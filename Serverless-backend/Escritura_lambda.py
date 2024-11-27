import json
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal

# Crear cliente de DynamoDB
dynamodb = boto3.resource('dynamodb')

# Nombre de las tablas
PRODUCT_TABLE = 'inventarioTais'
COUNTER_TABLE = 'id_counter_table'

# Función para convertir Decimal a float (o int si es un número entero)
def decimal_default(obj):
    if isinstance(obj, Decimal):
        if obj % 1 == 0:  # Verifica si es un número entero
            return int(obj)  # Convertir a entero
        return float(obj)  # Convertir a flotante
    raise TypeError(f"Type {type(obj)} not serializable")

def lambda_handler(event, context):
    print("Evento recibido:", json.dumps(event, default=str))

    # Headers CORS que se incluirán en todas las respuestas
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Amz-Date, X-Api-Key",
        "Access-Control-Max-Age": "86400"
    }

    # Manejo de solicitudes OPTIONS
    if event['httpMethod'] == 'OPTIONS':
        return {
            "statusCode": 200,
            "headers": cors_headers,
            "body": json.dumps({'message': 'CORS headers set'})
        }

    # Procesar solicitudes POST
    if event['httpMethod'] == 'POST':
        try:
            # Validar que el cuerpo de la solicitud esté presente
            if 'body' not in event or not event['body']:
                return {
                    "statusCode": 400,
                    "headers": cors_headers,
                    "body": json.dumps({"error": "Request body is missing"})
                }

            # Intentar decodificar el JSON
            print("Raw body:", event['body'])

            # Decodifica el JSON y verifica su contenido
            try:
                body = json.loads(event['body'])
                print("Decoded body:", body)
            except json.JSONDecodeError as e:
                return {
                    "statusCode": 400,
                    "headers": cors_headers,
                    "body": json.dumps({"error": f"Invalid JSON: {str(e)}"})
                }

            print("Body decodificado:", body)

            # Validar que los campos requeridos estén presentes y no sean vacíos
            required_fields = ['Code', 'Name', 'Description', 'Quantity', 'Price', 'Category']
            missing_fields = [field for field in required_fields if not body.get(field)]

            if missing_fields:
                return {
                    "statusCode": 400,
                    "headers": cors_headers,
                    "body": json.dumps({"error": f"Missing required fields: {', '.join(missing_fields)}"})
                }

            # Extraer valores
            code = body['Code']
            name = body['Name']
            description = body['Description']
            quantity = body['Quantity']
            price = body['Price']
            category = body['Category']

            # Verificar si el código ya existe
            product_table = dynamodb.Table(PRODUCT_TABLE)
            response = product_table.scan(
                FilterExpression="Code = :code",
                ExpressionAttributeValues={":code": code}
            )

            if response['Items']:
                return {
                    "statusCode": 400,
                    "headers": cors_headers,
                    "body": json.dumps({"error": f"Product with Code {code} already exists"})
                }

            # Generar un nuevo ID incremental
            counter_table = dynamodb.Table(COUNTER_TABLE)
            response = counter_table.update_item(
                Key={'CounterName': 'product_id_counter'},
                UpdateExpression="SET CounterValue = CounterValue + :val",
                ExpressionAttributeValues={':val': 1},
                ReturnValues="UPDATED_NEW"
            )
            new_product_id = response['Attributes']['CounterValue']

            # Insertar producto en la tabla
            product_table.put_item(
                Item={
                    'dynamo': str(new_product_id),
                    'Code': code,
                    'Name': name,
                    'Description': description,
                    'Quantity': quantity,
                    'Price': price,
                    'Category': category
                }
            )

            return {
                "statusCode": 200,
                "headers": cors_headers,
                "body": json.dumps({
                    "message": "Product registered successfully",
                    "product_id": new_product_id
                }, default=decimal_default)
            }

        except ClientError as e:
            print(f"Error de cliente: {str(e)}")
            return {
                "statusCode": 500,
                "headers": cors_headers,
                "body": json.dumps({"error": "Server error while accessing DynamoDB"})
            }
        except Exception as e:
            print(f"Error desconocido: {str(e)}")
            return {
                "statusCode": 500,
                "headers": cors_headers,
                "body": json.dumps({"error": "An unexpected error occurred"})
            }

    # Si no es POST ni OPTIONS
    return {
        "statusCode": 405,
        "headers": cors_headers,
        "body": json.dumps({"error": "Method not allowed"})
    }

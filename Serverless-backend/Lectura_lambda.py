import json
import boto3
from botocore.exceptions import ClientError
from decimal import Decimal

# Crear cliente de DynamoDB
dynamodb = boto3.resource('dynamodb')

# Nombre de la tabla
TABLE_NAME = 'inventarioTais'

# Custom encoder para convertir Decimal a float
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def lambda_handler(event, context):
    table = dynamodb.Table(TABLE_NAME)
    
    try:
        # Escaneo de todos los datos en la tabla
        response = table.scan()
        data = response.get('Items', [])
        
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Data retrieved successfully!",
                "data": data
            }, cls=DecimalEncoder)  # Usa el encoder personalizado
        }
    except ClientError as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": str(e)
            })
        }

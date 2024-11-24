from typing import Union,Optional
from fastapi import FastAPI
from redis_om import get_redis_connection, HashModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=['http://localhost:3000'], #config to FRONT
  allow_methods=['*'],
  allow_headers=['*']
)


redis = get_redis_connection(
  host=os.getenv("REDIS_HOST"),
  port= 12467,
  password=os.getenv("REDIS_PASSWORD"),
  decode_responses=True
)


class Product(HashModel):
  code: str  
  name: str  
  description: Optional[str] = None  
  quantity: int  
  unit_price: float  
  category: str  

  class Meta:
    database = redis


def format(pk: str):
  product = Product.get(pk)
  return {
    'id': product.pk,
    'code': product.code,
    'name': product.name,
    'description': product.description,
    'quantity': product.quantity,
    'unit_price': product.unit_price,
    'category': product.category
  }

@app.get('/products')
def all():
    return [format(pk) for pk in Product.all_pks()]

@app.post('/products')
def create(product: Product):
  return product.save()

@app.delete('/products/{pk}')
def delete(pk: str):
    return Product.delete(pk)
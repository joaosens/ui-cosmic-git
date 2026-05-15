import redis # NoSQL Database based key:value

redis_client = redis.asyncio.Redis(
    host="localhost",
    port=6379,
    decode_responses=True,
)
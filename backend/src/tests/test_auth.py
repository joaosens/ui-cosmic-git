from conftest import client

def test_signup(client):
    response = client.post("/signup", json={
        "username": "teste",
        "email": "teste@teste.com",
        "password": "senha123"
    })

    assert response.status_code == 200 # If not match this, raise AssertionError in Pytest 
    assert response.json() == {"message": "User created successfully"}
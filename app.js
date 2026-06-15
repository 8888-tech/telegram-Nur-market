body {
    font-family: 'Poppins', sans-serif; /* Zamonaviy shrift */
    background: #f8f9fa;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

#reg-page {
    background: white;
    padding: 35px;
    border-radius: 20px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08); /* Yumshoq soya */
    text-align: center;
    width: 85%;
    max-width: 320px;
}

h2 {
    font-size: 22px;
    margin-bottom: 20px;
    color: #333;
}

input {
    width: 100%;
    padding: 14px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 12px;
    box-sizing: border-box;
    font-size: 16px;
    transition: 0.3s;
}

input:focus {
    border-color: #27ae60;
    outline: none;
    box-shadow: 0 0 5px rgba(39, 174, 96, 0.2);
}

button {
    width: 100%;
    padding: 14px;
    background-color: #27ae60;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.3s;
    margin-top: 15px;
}

button:hover {
    background-color: #219150;
    transform: translateY(-2px); /* Kichik effekt */
}
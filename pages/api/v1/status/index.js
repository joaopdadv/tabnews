function status(request, response) {
    response.status(200).json({ chave: "teste de retorno da api joão" });
}

export default status;

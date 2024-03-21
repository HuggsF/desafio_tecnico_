Desafio tecnico

Framework utilizado - AdonisJs

Desenvolvimento de webhook de mudança de senha via serviço de mensageria

npm i

node ace serve

Rota post -> 'http://localhost:3333/send-to-queue'

Formato do body em JSON:

{
    "queue":"testQueue",
    "message": "<newPassword>",
    "id":"<userid>"
}

Foi utilizado mysql com XAMP localmente
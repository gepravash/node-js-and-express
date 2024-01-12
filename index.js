const express = require('express')
const app = express()

let persons = [
    {
      "id": 1,
      "name": "Jay Shrestha",
      "number": "9813257123 ",
      "important": true
    },
    {
      "id": 2,
      "name": "Jane Magar",
      "number": "986385001",
      "important": true
    },
    {
      "id": 3,
      "name": "Bijay Tuladhar",
      "number": "9813029012",
      "important": false
    },
    {
      "id": 4,
      "name": "Ali Khan",
      "number": "9841223456",
      "important": true
    },
    {
      "id": 5,
      "name": "Ajay Devgan",
      "number": "9865221000",
      "important": true
    },
    {
      "id": 6,
      "name": "Makar Giri",
      "number": "9861258947",
      "important": false
    },
    {
      "id": 7,
      "name": "Maya Giri",
      "number": "9861258941",
      "important": false
    },
    {
      "id": 8,
      "name": "Mayur Dhakal",
      "number": "9860145784",
      "important": false
    },
    {
      "id": 9,
      "name": "Pravash Shrestha",
      "number": "9860547812",
      "important": false
    },
    {
      "id": 10,
      "name": "Ram Krishna Dhakal",
      "number": "9851235689",
      "important": true
    }
  ]

const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  console.log('---')
  next()
}

const contentChecker = (request, response, next) => {
  if (request.body.name === undefined && request.body.number === undefined)
  {
    response.status(400).send({"error": "Name and number are missing in body."})
  }
  else if (request.body.name === undefined )
  {
    response.status(400).send({"error": "Name is missing in body."})
  }
  else if (request.body.number === undefined)
  {
    response.status(400).send({"error": "Number is missing in body"})
  }
  else
  {
    next()
  }
}

const nameDuplicationChecker = (request, response, next) => {
  const duplicateid = persons.find(person => person.id === request.body.id)
  const duplicatename = persons.find(person => person.name === request.body.name) 

  if (duplicateid)
  {
    response.status(400).send({ "error": `The id ${request.body.id} already exists in the phonebook.`})
  }
  else if (duplicatename)
  {
    response.status(400).send({ "error": `The name ${request.body.name} already exists in the phonebook.`})
  }
  else
  {
  next()
  }

}

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(express.json())

app.use(requestLogger)

app.get('/', (request, response) => {
  response.send("Home page")
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person)
  {
    response.json(person)
  }
  else
  {
    response.status(404).end()
  }
})

app.post('/api/persons', contentChecker, nameDuplicationChecker, (request, response) => {
  persons = persons.concat(request.body)
  console.log(persons)
  response.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
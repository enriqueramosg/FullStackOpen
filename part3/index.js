const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

const generateId = () => {
    return String(Math.floor(Math.random() * 1000000))
  }

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    // Validation: Check if name or number is missing
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number is missing' 
      })
    }
  
    // Validation: Check if the name already exists in the phonebook
    const nameExists = persons.some(person => person.name === body.name)
    if (nameExists) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }

    // Create new person object with generated id
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
    response.json(person)
})

app.get('/info', (request, response) => {
    const numberOfEntries = persons.length
    const currentDate = new Date()

    response.send(
        `<p>Phonebook has info for ${numberOfEntries} people</p>
        <p>${currentDate}</p>`
    )
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    }
    else{
        response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  
app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const person = {
      content: body.content,
      important: Boolean(body.important) || false,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
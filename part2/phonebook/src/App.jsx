import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import Error from './components/Error'

import personService from './services/persons'

import './index.css'

import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons  => {
        setPersons(initialPersons )
      })
      .catch(error => {
        console.error("There was an error fetching the data:", error);
      });
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const personExists = persons.find(person => person.name === newName)
    if (personExists) {
      if (personExists.number === newNumber){
        alert(`${newName} is already added to phonebook`)
        return
      }

      const confirmUpdate = window.confirm(
        `${newName} is already added to the phonebook, replace the old number with a new one?`
      )
      if (confirmUpdate){
        const updatedPerson = {...personExists, number: newNumber}

        personService
          .update(personExists.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person=>
              person.id!==personExists.id ? person :returnedPerson
            ))

            setNotificationMessage(
              `${returnedPerson.name}'s number was updated successfully`
            )
            setTimeout(() => {
              setNotificationMessage(null)
            }, 3000)

            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage(`Information of ${personExists.name} has already been removed from server`)
            setTimeout(() => setErrorMessage(null), 5000)

            setPersons(persons.filter(person => person.id !== personExists.id))
          })
      }

    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }

      personService
      .create(personObject)
      .then(returnedPerson  => {
        setPersons(persons.concat(returnedPerson))
        setNotificationMessage(
          `${returnedPerson.name} was added successfully`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 3000)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setErrorMessage(`Error adding person to the phonebook`)
        setTimeout(() => setErrorMessage(null), 5000)
      })
    }
  }

  const deletePerson = id => {
    const personToDelete = persons.find(person => person.id === id)
    const confirmDelete = window.confirm(`Delete ${personToDelete.name}?`)

    if (confirmDelete) {
      personService
        .deleteOne(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          setErrorMessage(
            `Information of ${personToDelete.name} has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setNotes(notes.filter(n => n.id !== id))
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person => 
    person.name.toLowerCase().includes(filter.toLowerCase()))
  

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Error message={errorMessage}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>

      <h3>Add New Person</h3>
      <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} addPerson={addPerson}/>

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App
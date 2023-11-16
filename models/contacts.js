const fs = require('fs/promises')
const path = require("path")
const { v4: uuidv4 } = require('uuid');

const url = path.join(__dirname, "contacts.json")

const listContacts = async () => {
  try {
    const response = await fs.readFile(url)

    return {
      success: true,
      result: JSON.parse(response.toString()),
      message: "List of contacts"
    }
  } catch (error) {
    return {
      success: false,
      result: null,
      message: error.message
    }
  }
}

const getContactById = async (contactId) => {
  try {
    const data = JSON.parse((await fs.readFile(url)).toString());

    const result = data.find((contact, index) => {
      if (contact.id == contactId) {
        return contact;
      }
    });

    if(!result) {
      return {
        success: false,
        result: null,
        message: "Not found"
      }
    }

    return {
      success: true,
      result: result,
      message: "Contact found"
    }
  } catch (error) {
    return {
      success: false,
      result: null,
      message: error.message
    }
  }
}

const removeContact = async (contactId) => {
  try {
    const contacts = JSON.parse((await fs.readFile(url)).toString());

    const result = contacts.filter(contact => contact.id !== contactId);

    if(contacts.length == result.length) {
      return {
        success: false,
        result: null,
        message: "Not found"
      }
    }

    await fs.writeFile(url, JSON.stringify(result))

    return {
      success: true,
      result: null,
      message: "Contact deleted successfully."
    }
  } catch (error) {
    return {
      success: false,
      result: null,
      message: error.message
    }
  }
}

const addContact = async (body) => {
  try {
    body.id = uuidv4();

    const contacts = JSON.parse((await fs.readFile(url)).toString());

    contacts.push(body)

    await fs.writeFile(url, JSON.stringify(contacts))

    return {
      success: true,
      result: body,
      message: "Contact added successfully."
    }
  } catch (error) {
    return {
      success: false,
      result: null,
      message: error.message
    }
  }
}

const updateContact = async (contactId, body) => {
  try {
    const result = await fs.readFile(url);
    const contacts = JSON.parse(result);

    const indexToUpdate = contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (indexToUpdate === -1) {
      return {
        success: false,
        result: null,
        message: "Contact not found",
      };
    }

    contacts[indexToUpdate] = {
      ...contacts[indexToUpdate],
      ...body,
    };

    await fs.writeFile(url, JSON.stringify(contacts, null, 2));

    return {
      success: true,
      result: contacts[indexToUpdate],
      message: "Contact updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      result: null,
      message: error.message
    }
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}

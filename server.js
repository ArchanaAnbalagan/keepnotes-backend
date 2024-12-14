const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json())
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "signup"
// })
const db = mysql.createConnection({
    host: "biqdq8muympwylusbr1u-mysql.services.clever-cloud.com",
    user: "uysmmt20zb9t7wzi",
    password: "n0RAkNY5Auw9Mkp9FBRB",
    database: "biqdq8muympwylusbr1u"
})
app.listen(8081, () => {
    console.log("listenning...")
})
app.post('/signup', (req, res) => {
    const generateRandomId = () => {
        return Math.floor(100 + Math.random() * 900); // Generates a number between 100 and 999
    };

    const randomId = generateRandomId();
    const sql = "INSERT INTO signin (`id`,`name`, `email`, `password`) VALUES (?,?, ?, ?)";
    const values = [
        randomId,
        req.body.name,
        req.body.email,
        req.body.password
    ];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Database error:", err); // Log the error for debugging
            return res.status(500).json({ message: "Internal Server Error" });
        }
        return res.json(data);
    });
});
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM signin WHERE `email`=? AND `password`= ? "

    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            console.log(data, "body")
            const userName = data[0].name; 
            const userid=data[0].id;// Assuming the name is in the first row
            return res.json({ message: "success", name: userName, id: userid });
            // return res.json("success")
        }
        else {
            return res.json("failed")
        }
    })


})

app.post('/notespost', (req, res) => {
    const generateRandomId = () => {
        return Math.floor(100 + Math.random() * 900); // Generates a number between 100 and 999
    };

    const randomId = generateRandomId();
    const date = new Date(); // This will give you the current date and time
    const formattedDate = date.toISOString();

    const sql = "INSERT INTO notes (`note_id`, `note_title`, `note_content`, `last_update`, `created_on`, `user_id`) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [
        randomId,
        req.body.note_title,
        req.body.note_content,
        formattedDate,
        formattedDate,
        req.body.user_id // Include user_id
    ];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Database error:", err); // Log the error for debugging
            return res.status(500).json({ message: "Internal Server Error" });
        }
        return res.json(data);
    });
});
app.get('/notesget/:userId', (req, res) => {
    const userId = req.params.userId; // Get the user ID from the request parameters
    const sql = "SELECT * FROM notes WHERE user_id = ?"; // SQL query to select notes for the specific user

    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Database error:", err); // Log the error for debugging
            return res.status(500).json({ message: "Internal Server Error" });
        }
        return res.json(data); // Send the retrieved data as a JSON response
    });
});;
app.put('/notes/:id', (req, res) => {
    const noteId = req.params.id; // Get the note ID from the request parameters
    const { note_title, note_content, user_id } = req.body; // Destructure the title, content, and user_id from the request body
    const date = new Date(); // Get the current date and time
    const formattedDate = date.toISOString(); // Format the date to ISO string

    // SQL query to update the note with the specified ID
    const sql = "UPDATE notes SET note_title = ?, note_content = ?, last_update = ? WHERE note_id = ? AND user_id = ?";
    const values = [note_title, note_content, formattedDate, noteId, user_id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database error:", err); // Log the error for debugging
            return res.status(500).json({ message: "Internal Server Error" });
        }

        // Check if any rows were affected (i.e., if the note existed and was updated)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Note not found or you do not have permission to edit this note" });
        }

        return res.json({ message: "Note updated successfully" }); // Send success response
    });
});

app.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id; // Get the note ID from the request parameters
    const userId = req.body.user_id; // Get the user ID from the request body

    // SQL query to delete the note with the specified ID and user ID
    const sql = "DELETE FROM notes WHERE note_id = ? AND user_id = ?";

    db.query(sql, [noteId, userId], (err, result) => {
        if (err) {
            console.error("Database error:", err); // Log the error for debugging
            return res.status(500).json({ message: "Internal Server Error" });
        }

        // Check if any rows were affected (i.e., if the note existed and was deleted)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Note not found or you do not have permission to delete this note" });
        }

        return res.json({ message: "Note deleted successfully" }); // Send success response
    });
});
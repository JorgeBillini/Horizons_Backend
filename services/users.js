const db = require('./db');
const UserService = {};
module.exports = UserService;

UserService.createUser = ({username, email, pic, interests, events_attended, xp}) =>{
    const sql = `
        INSERT INTO users 
        (username, email, pic, interests, events_attended, xp) 
        VALUES
        ($[username], $[email], $[pic], $[interests], $[events_attended], $[xp])
        RETURNING *;
    `;
    return db.one(sql, {username, email, pic, interests, events_attended, xp});
}

UserService.getUserByID = (id) =>{
    const sql =`
        SELECT *
        FROM users
        WHERE id = $[id];
    `;
    return db.one(sql, {id});
}

UserService.updateUserByID = (id, {username, email, pic, interests, events_attended, xp}) =>{
    const sql = `
        UPDATE users
        SET
            username = $[username],
            email = $[email],
            pic = $[pic],
            interests = $[interests],
            events_attended = $[events_attended],
            xp = $[xp]
        WHERE
            id = $[id]
        RETURNING *;
    `;
    return db.one(sql, {id, username, email, pic, interests, events_attended, xp});
}

UserService.deleteUser = (id) =>{
    const sql = `
        DELETE FROM users 
        WHERE id = $[id]
        RETURNING *;
    `;
    return db.one(sql, {id});
}
const db = require('./db');
const AwardService = {};
module.exports = AwardService;

AwardService.createAward = ({user_id, badge_id}) =>{
    const sql = `
        INSERT INTO awards 
        (user_id, badge_id)
        VALUES
        ($[user_id], $[badge_id])
        RETURNING *;
    `;
    return db.one(sql, {user_id, badge_id});
}

AwardService.getAwardByID = (id) =>{
    const sql =`
        SELECT a.*, b.badge_name, b.badge_description, b.badge_xp_value, b.badge_image
        FROM awards a
        JOIN badges b
        ON a.badge_id = b.id
        WHERE a.id = $[id];
    `;
    return db.one(sql, {id});
}

AwardService.updateAwardByID = (id, {user_id, badge_id}) =>{
    const sql = `
        UPDATE awards
        SET
            user_id = $[user_id],
            badge_id = $[badge_id]
        WHERE
            id = $[id]
        RETURNING *;
    `;
    return db.one(sql, {id, user_id, badge_id});
}

AwardService.deleteAwardByID = (id) =>{
    const sql = `
        DELETE FROM awards 
        WHERE id = $[id]
        RETURNING *;
    `;
    return db.one(sql, {id});
}
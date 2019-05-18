const db = require('./db');
const BadgeService = {};
module.exports = BadgeService;

BadgeService.createBadge = ({badge_name, badge_description, badge_image}) =>{
    const sql = `
        INSERT INTO badges 
        (badge_name, badge_description, badge_image) 
        VALUES
        ($[badge_name], $[badge_description], $[badge_image])
        RETURNING *;
    `;
    return db.one(sql, {badge_name, badge_description, badge_image});
}

BadgeService.getBadgeByID = (id) =>{
    const sql =`
        SELECT *
        FROM badges
        WHERE id = $[id];
    `;
    return db.one(sql, {id});
}

BadgeService.updateBadgeByID = (id, {badge_name, badge_description, badge_image}) =>{
    const sql = `
        UPDATE badges
        SET
            badge_name = $[badge_name],
            badge_description = $[badge_description],
            badge_image = $[badge_image]
        WHERE
            id = $[id]
        RETURNING *;
    `;
    return db.one(sql, {id, badge_name, badge_description, badge_image});
}

BadgeService.deleteBadge = (id) =>{
    const sql = `
        DELETE FROM badges 
        WHERE id = $[id]
        RETURNING *;
    `;
    return db.one(sql, {id});
}
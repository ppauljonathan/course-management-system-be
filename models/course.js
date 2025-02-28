'use strict';

const db = require('../config/database');

const calculateCurrentTime = () => new Date();

const findAll = async () => {
    const result = await db.query(
        `
            SELECT * FROM courses
            WHERE deleted_at IS NULL
            ORDER BY id ASC
        `
    );
    return result.rows;
};

const find = async (id) => {
    const result = await db.query(
        `
            SELECT * FROM courses
            WHERE id = $1 AND deleted_at IS NULL
        `,
        [id]
    );
    return result.rows[0] || null;
};

const create = async ({ name, description, price }) => {
    const currentTime = calculateCurrentTime();
    const result = await db.query(
        `
            INSERT INTO courses (name, description, price, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        [name, description, price, currentTime, currentTime]
    );
    return result.rows[0];
};

const update = async ({ id, name, description, price }) => {
    const result = await db.query(
        `
            UPDATE courses
            SET name = $1, description = $2, price = $3, updated_at = $4
            WHERE id = $5 AND deleted_at IS NULL
            RETURNING *
        `,
        [name, description, price, calculateCurrentTime(), id]
    );
    return result.rows[0] || null;
};

const destroy = async (id) => {
    const result = await db.query(
        `
            UPDATE courses
            SET deleted_at = $1
            WHERE id = $2 AND deleted_at IS NULL
            RETURNING *
        `,
        [calculateCurrentTime(), id]
    );
    return result.rows[0] || null;
};

module.exports = { findAll, find, create, update, destroy };

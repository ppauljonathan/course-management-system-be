'use strict';

const db = require('../config/database');
const { PER_PAGE, MAX_PER_PAGE } = require('../constants')
const { courseCreationValidator, courseUpdationValidator } = require('../validators/course')

const calculateCurrentTime = () => new Date();

const findAll = async (page = 1, per = PER_PAGE) => {
    per = Math.min(per, MAX_PER_PAGE);

    const result = await db.query(
        `
            SELECT * FROM courses
            WHERE deleted_at IS NULL
            ORDER BY id ASC
            LIMIT $1
            OFFSET $2
        `,
        [
            per,
            (page - 1) * per
        ]
    );
    return result.rows;
};

const pageInfo = async (page = 1, per = PER_PAGE) => {
    per = Math.min(per, MAX_PER_PAGE);

    const result = await db.query(
        `SELECT COUNT(id) FROM courses WHERE deleted_at IS NULL`,
        []
    );

    const count = result.rows[0].count;

    return {
        page: page,
        per: per,
        totalRecords: count,
        totalPages: Math.max(1, Math.ceil(count / per))
    };
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
    const errors = courseCreationValidator({ name, description, price });

    if (errors.length != 0) {
        return { errors }
    }

    const currentTime = calculateCurrentTime();
    const result = await db.query(
        `
            INSERT INTO courses (name, description, price, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `,
        [name, description, price, currentTime, currentTime]
    );
    const course = result.rows[0]

    return { course, errors };
};

const update = async ({ id, name, description, price }) => {
    const errors = courseUpdationValidator({ id, name, description, price });

    if (errors.length != 0) {
        return { errors }
    }

    const result = await db.query(
        `
            UPDATE courses
            SET name = $1, description = $2, price = $3, updated_at = $4
            WHERE id = $5 AND deleted_at IS NULL
            RETURNING *
        `,
        [name, description, price, calculateCurrentTime(), id]
    );
    const course = result.rows[0] ||null;

    return { course, errors };
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
    const course = result.rows[0] ||null;

    return { course, errors: [] };
};

module.exports = { findAll, find, create, update, destroy, pageInfo };

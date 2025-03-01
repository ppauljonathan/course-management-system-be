'use strict';

const courseCreateInputType = `
    input CourseCreateInput {
        name: String!,
        description: String!,
        price: String!
    }
`;

const courseUpdateInputType = `
    input CourseUpdateInput {
        id: ID!,
        name: String!,
        description: String!,
        price: String!
    }
`;

const inputTypes =
    courseCreateInputType +
    courseUpdateInputType;

module.exports = inputTypes;

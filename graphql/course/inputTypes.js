'use strict';

const courseCreateInputType = `
	input CourseCreateInput {
		name: String!,
		description: String!,
    live: Boolean!
	}
`;

const courseUpdateInputType = `
	input CourseUpdateInput {
		id: ID!,
		name: String!,
		description: String!,
    live: Boolean,
    chapter_order: [Int]
	}
`;

const inputTypes =
	courseCreateInputType +
	courseUpdateInputType
;

module.exports = inputTypes;

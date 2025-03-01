'use strict';

const Course = require('../../models/course');

const resolvers = {
  async courses({ page, per }) {
    const courses = await Course.findAll(page, per);
    const pageInfo = await Course.pageInfo(page, per);
    return { courses, pageInfo };
  },
  async course({ id }) {
    return await Course.find(id);
  },
  async courseCreate({ course }) {
    return await Course.create(course);
  },
  async courseUpdate({ course }) {
    return await Course.update(course);
  },
  async courseDelete({ id }) {
    return await Course.destroy(id);
  }
}

module.exports = resolvers;

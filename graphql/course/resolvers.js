'use strict';

const Course = require('../../models/course');

module.exports.courseResolvers = {
  async courses({ page, per }) {
    const courses = await Course.findAll(page, per);
    const pageInfo = await Course.pageInfo(page, per);
    return { courses, pageInfo };
  },
  async course({ id }) {
    return await Course.find(id)
  },
  async courseCreate() {

  },
  async courseUpdate() {

  },
  async courseDelete() {

  }
}

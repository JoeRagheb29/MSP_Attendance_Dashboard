"use strict";
/**
 * attendee controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::attendee.attendee', ({ strapi }) => ({
    // Get all attendees
    async find(ctx) {
        const attendees = await strapi.entityService.findMany('api::attendee.attendee', {
            populate: '*',
        });
        ctx.body = attendees;
    },
    // Create attendee
    async create(ctx) {
        const { data } = ctx.request.body;
        const attendee = await strapi.entityService.create('api::attendee.attendee', {
            data,
        });
        ctx.body = attendee;
    },
    // Update attendee
    async update(ctx) {
        const { id } = ctx.params;
        const { data } = ctx.request.body;
        const attendee = await strapi.entityService.update('api::attendee.attendee', id, {
            data,
        });
        ctx.body = attendee;
    },
    // Delete attendee
    async delete(ctx) {
        const { id } = ctx.params;
        await strapi.entityService.delete('api::attendee.attendee', id);
        ctx.body = { message: 'Attendee deleted' };
    },
}));

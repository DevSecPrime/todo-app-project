/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    knex.schema.createTable("tasks", (table) => {
        table.increments("id").primary();
        table.integer("userId")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
            .unsigned();
        table.integer("groupId")
            .references("id")
            .inTable("groups")
            .onDelete("CASCADE")
            .unsigned();
        table.integer("projectId")
            .references("id")
            .inTable("projects")
            .onDelete("CASCADE")
            .unsigned()
        table.string("taskName").notNullable();
        table.text("description").nullable();
        table.string("logo").nullable();
        table.string("status").enum("pending", "in-progress", "completed").defaultTo("pending");
        table.timestamp("startingDate").defaultTo(knex.fn.now());
        table.timestamp("endingDate").nullable().defaultTo(knex.fn.now());
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    knex.schema.dropTable("tasks");
};

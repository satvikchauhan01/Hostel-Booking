export const up = (pgm) => {

    pgm.addColumn("users", {

        password: {

            type: "text",

            notNull: true

        }

    });

};

export const down = (pgm) => {

    pgm.dropColumn("users", "password");

};
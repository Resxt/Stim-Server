const {Sequelize, DataTypes} = require("sequelize");
const axios = require("axios");
const {stripHtml} = require("string-strip-html");
const utils = require('./utils')

const sequelize = new Sequelize(
    "database",
    "username",
    "password",
    {
        host: "0.0.0.0",
        dialect: "sqlite",
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },

        storage: "db/database.sqlite"
    }
);

sequelize
    .authenticate()
    .then(function(err) {
        console.log("Connection established.");

        App = sequelize.define("App", {
            name: {
                type: Sequelize.TEXT
            },
            appId: {
                type: Sequelize.INTEGER
            },
            requiredAge: {
                type: Sequelize.INTEGER
            },
            descriptionLong: {
                type: Sequelize.TEXT
            },
            descriptionShort: {
                type: Sequelize.TEXT
            },
            supportedLanguages: {
                type: Sequelize.STRING
            },
            headerImageUrl: {
                type: Sequelize.TEXT
            },
            website: {
                type: Sequelize.TEXT
            },
            pcRequirementsMinimum: {
                type: Sequelize.TEXT
            },
            pcRequirementsRecommended: {
                type: Sequelize.TEXT
            },
            legalNotice: {
                type: Sequelize.TEXT
            },
            developers: {
                type: Sequelize.TEXT
            },
            publishers: {
                type: Sequelize.TEXT
            },
            price: {
                type: Sequelize.TEXT
            },
            positiveRecommendations: {
                type: Sequelize.INTEGER
            },
            releaseDate: {
                type: Sequelize.TEXT
            },
            supportUrl: {
                type: Sequelize.TEXT
            },
            supportEmail: {
                type: Sequelize.TEXT
            },
            backgroundImageUrl: {
                type: Sequelize.TEXT
            }
        })

        App.sync()
    })
    .catch(function(err) {
        console.log("Unable to connect to database: ", err);
    });

async function findAll() {
    console.log('-')

    const apps = await App.findAll();
    if (apps == null || apps.length === 0) {
        console.log('No apps found')
    }
    else {
        console.log(apps.length + ' apps found');
        for (let i = 0; i < apps.length; i++) {
            console.log(apps[i]);
            console.log(apps[i].appId);
        }

        return apps;
    }
}

async function findOneByAppId(appId) {
    console.log('-')

    const app = await App.findOne({where: {appId: appId}});
    if (app === null) {
        console.log(appId + ' not found!');
    } else {
        console.log(appId + ' found!')
        console.log(app instanceof App);
        console.log(app);

        return app;
    }
}

async function create(appId) {
    console.log('-')

    try {
        const response = await axios.get('https://store.steampowered.com/api/appdetails?appids=' + appId);
        const receivedData = response.data[appId].data;

        let developers = utils.arrayToString(receivedData.developers, ',');
        let publishers = utils.arrayToString(receivedData.publishers, ',');

        const newGame = await App.create({
            name: receivedData.name,
            appId: receivedData.steam_appid,
            requiredAge: receivedData.required_age,
            descriptionLong: stripHtml(receivedData.detailed_description).result,
            descriptionShort: stripHtml(receivedData.short_description).result,
            supportedLanguages: stripHtml(receivedData.supported_languages).result,
            headerImageUrl: receivedData.header_image,
            website: receivedData.website,
            pcRequirementsMinimum: stripHtml(receivedData.pc_requirements.minimum).result,
            pcRequirementsRecommended: stripHtml(receivedData.pc_requirements.recommended).result,
            legalNotice: stripHtml(receivedData.legal_notice).result,
            developers: developers,
            publishers: publishers,
            price: receivedData.price_overview.final_formatted,
            positiveRecommendations: receivedData.recommendations.total,
            releaseDate: receivedData.release_date.date,
            supportUrl: receivedData.support_info.url,
            supportEmail: receivedData.support_info.email,
            backgroundImageUrl: receivedData.background,
        });

        console.log(newGame.name + " has been added to the database")

        return newGame;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { create, findAll, findOneByAppId };

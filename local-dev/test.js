const newman = require('newman');

newman.run({
    collection: '../examples/Restful_Booker_Collection.json',
    environment: '../examples/Restful_Booker_Environment.json',
    reporters: ['htmlextra'],
    iterationCount: 5,
    reporter: {
        htmlextra: {
            export: './report.html'
            // logs: true,
            // showOnlyFails: true,
            // darkTheme: true,
            // noSyntaxHighlighting: true,
            // omitHeaders: true,
            // testPaging: true,
            // browserTitle: "My Newman report",
            // title: "My Newman Report",
            // titleSize: 4,
            // skipHeaders: "Content-Type",
        }
    }
});

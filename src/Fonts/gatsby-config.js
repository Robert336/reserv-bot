module.exports = {
    plugins: [
        {
            resolve: "gatsby-plugin-web-font-loader",
            options: {
                google: {
                    families: ["Domine", "Work Sans", "Happy Monkey", "Merriweather", "Open Sans", "Lato", "Montserrat"]
                }
            }
        },
    ]
}
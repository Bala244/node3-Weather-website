const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialspath = path.join(__dirname,'../templates/partials')

app.set('view engine', 'hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialspath)


app.use(express.static(publicDirectoryPath))


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'BNK'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'BNK'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        helpText1:'=>Type Your Location and Click The Search Button',
        helpText2:' =>Get Your Weather Result',
        title:'Help',
        name:'BNK'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error:'You Must Provide An Address'
        })
}
    
    geocode(req.query.address,(error,{ latitude,longitude,location} = {}) => {
        if (error){
            return res.send({error})
        }
        forecast(latitude,longitude,(error,forecastData) => {
            if (error){
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.listen(port, () => {
    console.log('Server is up on port.'+ port)
})
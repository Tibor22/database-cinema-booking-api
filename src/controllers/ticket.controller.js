const prisma = require('../utils/prisma');

const createTicket = async function(req, res) {

    const ticket = req.body;
    console.log(ticket);

    const newTicket= await prisma.ticket.create({
        data:{ 
            customer: {
                connect:{id: +ticket.customerId}
            },
            screening: {
                connect:{id: +ticket.screeningId}
            }
        },
        include: {
           customer: true,
           screening : true,
           screening : {
               include : {
                   movie :true,
                   screen: true,
               }
           }
        //    movie :true,
        //    screen :true,
        }
    })
console.log(newTicket);
    res.json({data:newTicket})
}

module.exports = {
    createTicket,
}
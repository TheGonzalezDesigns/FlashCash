"use strict";

//const fs = require("fs");
//const repack = require('../baggage/suitcase.js');
// const deliver = require("../baggage/deliver.js");
const board = require("../baggage/board.js");
// const { utils: blockchain } = require("./../../interface.js");
//const call = require("../call.js")

const inspect = (tag, res) =>
  false; /* && console.log(`Call response [${tag}]: `, typeof res); */

module.exports = async function (fastify, opts) {
  fastify.post("/queue", async function (request, reply) {
    const flight = request.body
    const { chainId } = request.query;

    const from = flight.from;
    const to = flight.to;

    const ticket = {
      from: from,
      to: to,
    };
    // console.log("Ticket: ", ticket);
    let flights;
    const tag = "Queue flights";
    const start = performance.now();
    flights = await board(ticket.from, ticket.to, chainId);
    const end = performance.now();

    const runtime = end - start;

    inspect(tag, flights);
    const tradable = flights.length > 0;
    if (tradable) {
      console.log(
        `\t🛬⌚${runtime < 1000 ? "🔥" : "🐢"} Flights Runtime: ${runtime / 1000
        } seconds`
      );
      // console.log("Flights: ", flights);
      try {
        const deploy = async (flight) => {
          const path = "deploy";
          const ops = {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(flight),
          };
          return await fetch(`http://localhost:3000/${path}`, ops);
        };
        const retry = async (flight) => {
          const path = "retry";
          const ops = {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(flight),
          };
          return await fetch(`http://localhost:3000/${path}`, ops);
        };
        let reports = [];
        for (let uint = 0, report, flight; uint < flights.length; uint++) {
          flight = flights[uint];
          // console.log("deploying flight: ", flight);
          try {
            report = await (await deploy(flight)).json();
            inspect("deploy report", report);
            report.price = flight.price;
            report.profit = flight.profit;
            report.profitability = flight.profitability;
            report.total = flight.total;
            report.gas = flight.gas;
            report.fiatCode = flight.fiatCode;
            report.loanAmount = flight.loanAmount;
            report.output = flight.output;
            report.tokens = flight.tokens;
            if (report.status == 200) {
              console.log(
                "💰💸💰💸💰💸🤑💰💸💰💸💰💸🤑💰💸💰💸💰💸🤑💰💸💰💸💰💸🤑💸💰"
              );
              console.log(`🚀 R-${uint}/${flights.length}:`, report);
              console.log(
                "💰💸💰💸💰💸🤑💰💸💰💸💰💸🤑💰💸💰💸💰💸🤑💰💸💰💸💰💸🤑💸💰"
              );
              reports.push(report);
            } else {
              if (false && report.error.includes("UNPREDICTABLE_GAS_LIMIT")) {
                report = await (await retry(flight)).json();
                report.price = flight.price;
                report.profit = flight.profit;
                report.total = flight.total;
                report.gas = flight.gas;
                if (report.status == 200) {
                  console.log(`🚀 R-${uint}:`, report);
                  reports.push(report);
                } else console.error(`☔ R-${uint}:`, report);
              } else
                console.error(
                  `☔ R-${uint}/${flights.length}:`,
                  /* JSON.stringify */ report
                );
            }
          } catch (e) {
            console.error(e);
          }
        }
        return reports.length
          ? { status: 200, reports: reports }
          : { status: 500, message: "Nothing Achieved yet." };
      } catch (e) {
        console.error(
          "****************DELIVERY**HAS***FAILED*********************"
        );
        console.error("*", e);
        console.error(
          "****************DELIVERY**HAS***FAILED*********************"
        );

        return { status: 500, error: e };
      }
      console.error(":::::::INTO THE VOID:::::");
    }
    return { status: 500, error: { msg: "unprofitable" } };
  });
};

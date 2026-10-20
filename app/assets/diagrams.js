/* Shop drawings for this WJ. Labels are ours. Not factory art and not a photo of the truck. */
(function () {
  function tx(s) {
    return String(s == null ? "" : s).replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
  }
  function card(tone, title, text) {
    return '<div class="dcard ' + tone + '"><b>' + tx(title) + "</b><span>" + tx(text) + "</span></div>";
  }
  function row() {
    return '<div class="drow">' + Array.prototype.join.call(arguments, "") + "</div>";
  }
  function down(text) {
    return '<div class="darrow">' + tx(text || "↓") + "</div>";
  }
  function note(text) {
    return '<p class="dnote">' + tx(text) + "</p>";
  }
  function fig(title, caption, find, html) {
    return { title: title, caption: caption, find: find, html: html };
  }

  window.STEPHS_FIGS = {
    keyon: fig(
      "Key-on P0505 is a circuit test",
      "A vacuum leak and a shoved pintle change idle only after the engine is running. An instant code at key-on is electrical. The PCM driver is {{poss:POSSIBLE}} only after the powered checks are clean.",
      "diagram key on p0505 pcm vacuum leak short to power",
      row(
        card("stop", "Cannot cause key-on P0505", "A vacuum leak. Cracked elbows. A pintle that was pushed, if the coils still measure good. Those change a running idle."),
        card("test", "Can cause key-on P0505", "Open driver wire. Short to ground. Short to power with the key on. A pin that only connects when a probe is forced in."),
        card("warn", "PCM driver, last", "Only after the harness is clean with C1 unplugged and the code still sets with a known-good IAC. Not confirmed today.")
      ) + note("Do not jumper the ASD relay. Do not start the engine while oil is on the manifold.")
    ),
    split3: fig(
      "Three problems. No arrow between them.",
      "Idle, oil-fire, and P0161 stay separate. A misfire can glow the manifold without the idle chain. {{stop:STOP}} if the iron is orange or oil is on the exhaust.",
      "diagram three problems idle oil p0161 separate",
      row(
        card("warn", "A · Idle", "Pintle moved, extra air, high idle, P0505. Lean and a glow are still unproven until tested."),
        card("stop", "B · Oil and fire", "Fresh oil on hot iron or on a sensor. Degrease cold. Not the idle chain."),
        card("test", "C · P0161", "Bank 2 Sensor 2 heater circuit only. Not a mixture code. Not the idle.")
      ) + note("Do not draw a line from one of these to the others and call it the diagnosis.")
    ),
    places: fig(
      "Where the two fuse boxes are",
      "Locations from the 2004 owner manual. {{stated:PUBLISHED}} The lid and the cover are the maps. This is not a 2005 and later WK, and it is not an IPM.",
      "diagram where fuse box pdc junction under hood steering column",
      row(
        card("test", "Under the hood", "Power distribution center, the box by the battery. Cartridges, mini fuses, and ISO relays. Open the lid. That label names every cavity."),
        card("test", "Driver's seat", "Junction block in the lower panel, just left of the steering column. The stamped cover names every fuse, breaker, and relay in that block.")
      ) + note("Do not use a picture of a 2005+ Grand Cherokee. Those trucks are a different body and a different box.")
    ),
    fusetest: fig(
      "Test the fuse. Do not trust the look.",
      "A fuse can look intact and be open. Same amp, same body. {{stop:STOP}} upsizing. A breaker is not a fuse.",
      "diagram test fuse ohms voltage puller breaker",
      card("plain", "1 · Key off", "Write down the cavity. Pull it with a fuse puller.") +
      down() +
      card("test", "2 · Ohms across the blades", "Out of the block. Near 0 ohms means it conducts. OL means open.") +
      down("or") +
      card("test", "3 · Voltage on both sides", "Circuit powered. Power on the feed and nothing on the load means the fuse is open.") +
      note("Mini blade and cartridge are different bodies. If the new fuse opens at once, stop and find the short.")
    ),
    pdcflow: fig(
      "Under-hood power, as a flow",
      "Service-chart jobs. {{stated:CHART}} Cartridge 15 is also the owner-manual Ignition-Off Draw fuse. {{stated:PUBLISHED}} This is not the physical lid. The lid wins. Cavity 12 is a conflict and is not drawn.",
      "diagram pdc asd fuel pump oxygen blower fan iod flow not the lid",
      card("plain", "Battery", "Into the under-hood power distribution center.") +
      down() +
      row(
        card("warn", "Cartridge 6 · ASD", "Chart: coils, injectors, and a feed toward fuses 16 and 26. Not the only heater fuse."),
        card("test", "Mini 16 · O2", "Chart: oxygen sensors. 2001–2004 wording also names the downstream O2 relay."),
        card("test", "Mini 24 · Pump", "Chart: fuel pump, 20A. Relay R1 on that same chart.")
      ) +
      row(
        card("test", "Mini 19 · PCM", "Chart: 10A."),
        card("test", "Cartridge 10 · Fan", "Chart: radiator fan on the 4.0, 40A."),
        card("test", "Cartridge 1 · Blower", "Chart: 40A.")
      ) +
      card("good", "Cartridge 15 · IOD", "Owner manual: pull this cartridge if the truck sits more than 21 days, and only if the lid says Ignition-Off Draw. Presets and the clock are lost.") +
      note("Interior fuse 12, cartridge 6, and mini 16 are three published names on the ASD and oxygen-sensor path. Meter the cavity the lid names. Do not pick one from this drawing.")
    ),
    cab: fig(
      "Driver-side block. The cover is the map.",
      "2004 owner-manual interior chart. {{stated:PUBLISHED}} Fuse 12 is one ASD name, not the whole heater circuit. C1 and C2 reset themselves.",
      "diagram junction block driver side fuse 12 breaker cover",
      row(
        card("test", "Just left of the column", "Lower instrument panel. Pop the cover. Read the stamp before you pull anything."),
        card("warn", "Fuse 12", "Owner chart: auto shut down relay / Fuel, 10A red. Still measure the under-hood lid before you call a heater fuse."),
        card("plain", "C1 and C2", "Wiper breaker and seat breaker, 20A. They click and reset. Do not swap in a bigger fuse.")
      )
    ),
    heater: fig(
      "P0161 heater path. No cavity on this drawing.",
      "The walk still refuses to name a fuse. {{test:TEST REQUIRED}} Power is about 10–12 V only while the ASD feed is actually on. A key-on 0 V can be the relay already dropped out.",
      "diagram heater asd relay oxygen sensor p0161 no cavity",
      card("plain", "Battery", "Through the ASD relay. Charts call that relay R10.") +
      down() +
      card("stop", "The fuse the lid names", "No number is printed here on purpose. A shorted heater can open it. A good-looking fuse can still be open.") +
      down() +
      card("test", "Bank 2 Sensor 2 heater", "Rear downstream, after the rear mini-cat. Cold ohms about 4–10. The PCM pulls the control side. Compare with another sensor before you condemn this one.") +
      note("Do not swap sensors. Do not grease the connector. Oil on this sensor is the oil page, not an automatic new sensor.")
    ),
    iod: fig(
      "Storage pull versus a draw",
      "Owner manual: cartridge 15, labeled Ignition-Off Draw, if it sits more than 21 days. {{stated:PUBLISHED}} A junction-block connector story is a different description. Match the label in your hand.",
      "diagram iod storage draw battery fuse 15",
      row(
        card("good", "Sits for weeks", "Pull the under-hood cartridge the lid calls Ignition-Off Draw. Expect the radio presets and the clock to die."),
        card("warn", "Dies overnight", "That is a draw or a lamp or a relay that stayed on. Find the circuit. Do not buy a power distribution center first.")
      ) + note("Do not pull airbag fuses 32 and 33 as a casual draw test.")
    ),
    grounds: fig(
      "Grounds before a module",
      "Voltage drop while cranking. {{likely:LIKELY}} method, not a factory limit printed on these sheets. More than about half a volt means clean that path.",
      "diagram ground battery engine block voltage drop",
      card("plain", "Battery negative post", "The meter reference. Both cable ends clean to metal.") +
      down() +
      row(
        card("test", "To the engine block", "While a helper cranks. A bad engine ground clicks the starter and lies to the gauges together."),
        card("test", "To the body", "Same test. Several dead circuits at once are a shared ground or a shared feed.")
      ) + note("No ground number is printed here. Follow the cable you can see.")
    ),
    nocrank: fig(
      "No crank. The engine does not turn.",
      "Starter relay position is {{stated:CHART}}. The lid wins. A key wiggle is {{likely:LIKELY}} the column switch, which is not the lock cylinder. Security light on is the other page.",
      "diagram no crank starter relay park neutral ignition switch",
      row(
        card("test", "Battery and both cables", "Dim lights and a click are power or a ground. Rapid clicking is low voltage."),
        card("test", "Park, then Neutral", "Wheels chocked. A sloppy Park switch is a common no-crank on these trucks.")
      ) +
      down() +
      card("warn", "Ignition switch", "If moving the key changes it, the switch on the column is the suspect. Do not buy a power distribution center for a wiggle.") +
      down() +
      card("test", "Starter relay, then the starter", "Charts call the relay R2. Swap only with the same type the lid shows.") +
      note("Jumping the starter is a test only: Park, chocked, clear of the fan. It does not find the cause. Do not do it with the security light on.")
    ),
    nofire: fig(
      "It turns. It does not catch.",
      "Split fuel from spark before a sensor. Coil rail and no distributor are {{conf:CONFIRMED}} on this package. ASD behavior here is {{likely:LIKELY}} until you measure it.",
      "diagram crank no start fuel pump asd spark coil rail",
      row(
        card("test", "Fuel", "Key on. Listen at the tank for a one-to-two-second prime. Chart: mini 24 and relay R1. Lid wins."),
        card("test", "Spark and injectors", "Chart: cartridge 6 and ASD relay R10 feed the coil rail and the injectors. No spark and no pulse together points at that feed or at the crank signal.")
      ) + note("Prove it with a spark tester or a noid light. Do not pierce wires. No starting fluid if the manifold has glowed or oil is on the pipe.")
    ),
    hotstall: fig(
      "Dies hot. Restarts when it cools.",
      "On the 4.0 that pattern is a {{likely:LIKELY}} crank-sensor fault: the sensor, the plug, or the wire. No part number and no recall number are printed here.",
      "diagram hot stall crank sensor bellhousing cam sensor",
      card("warn", "The pattern", "Runs. Dies hot. Cranks and will not catch. Starts again after it cools.") +
      down() +
      card("test", "Crank sensor", "On the bellhousing. Confirm the plug in your hand. A careful hot wiggle, clear of the fan and the exhaust, that brings it back means fix the connection first.") +
      down() +
      card("plain", "Cam sensor is the other signal", "Where the distributor used to be, in the oil-pump drive. Likely location. Confirm the plug. Not the same part, and not this pattern by itself.") +
      note("Look this VIN up at NHTSA before you buy anything because a listing quoted a campaign.")
    ),
    engine: fig(
      "4.0 callouts",
      "Coil rail, no plug wires, no distributor. {{conf:CONFIRMED}} Crank and cam locations are {{likely:LIKELY}}. Confirm the plugs on the engine.",
      "diagram engine 4.0 coil rail iac crank sensor cam sensor distributor",
      row(
        card("good", "Coil rail", "One rail over the plugs. A one-cylinder miss is not automatically a new rail. No plug number on this drawing."),
        card("stop", "IAC", "On the throttle body. Do not push the pintle. Not in the box, not to seat it. Good ohms do not save a pushed pintle.")
      ) +
      row(
        card("test", "Crank sensor", "Bellhousing. The hot-stall pattern lives here more often than in the cam sensor."),
        card("test", "Cam sensor", "Oil-pump drive, the old distributor hole. A no-start signal. A different part from the crank sensor.")
      )
    ),
    charge: fig(
      "Charging path",
      "Voltage screens are {{likely:LIKELY}}, not a factory limit on these sheets. The belt is ahead of the alternator. A battery that dies while parked is the IOD page.",
      "diagram alternator charging voltage belt battery",
      card("plain", "Belt on the alternator pulley", "No belt, no charge.") +
      down() +
      row(
        card("test", "Running", "Usual screen about 13.5–14.5 V at the posts, loads on. Under about 13 V: belt, the plug, the heavy cable, the grounds, then the alternator."),
        card("test", "Key off, after a rest", "Usual screen about 12.4–12.7 V. Right after shutdown reads high because of surface charge.")
      ) + note("Clean the posts before you condemn the alternator. Do not replace the power distribution center because the gauge reads low.")
    ),
    skim: fig(
      "Security light is its own path",
      "SKIM is the immobilizer. It is not a starter and it is not an ASD fuse. Try the other key before a PCM. No part number here.",
      "diagram skim security light immobilizer key",
      row(
        card("warn", "Light stays on", "No-start, or starts and dies. The other key is the first test. A missing pellet fails the truck and does not fail the starter."),
        card("plain", "Light is off", "If the engine still will not turn, use the no-crank drawing. Fuses 32 and 33 are airbag feeds, not a SKIM repair.")
      )
    ),
    belt: fig(
      "One belt runs the accessories",
      "The electric radiator fan is not on this belt. No belt part number. Match a 4.0, and read the number on the old belt if you can.",
      "diagram serpentine belt alternator water pump power steering",
      card("stop", "If it shreds", "No charge, no power steering, no water-pump flow. Pull over. Do not keep driving it hot.") +
      down() +
      row(
        card("test", "On the belt", "Alternator, power-steering pump, water pump, and the viscous fan clutch on that pump."),
        card("plain", "Not on the belt", "The electric radiator fan. A missing belt is not saved by that fan.")
      ) + note("A belt that walks off is often a tensioner or an idler. Stay clear of a running belt.")
    ),
    cooling: fig(
      "Two fans. Overheat is not a glow.",
      "Viscous clutch plus an electric fan. Cavity 10 is {{stated:CHART}}. The usual 195°F thermostat is {{likely:LIKELY}}. A pegged gauge is a shutdown.",
      "diagram cooling viscous fan electric fan thermostat overheat",
      row(
        card("test", "Viscous fan", "On the water pump. The belt turns the pump. A clutch that never roars when it is hot, in traffic, is the suspect. A clutch that roars cold is locked."),
        card("test", "Electric fan", "At the radiator. A/C and extra cooling. Chart cavity 10 is 40A on the 4.0. Lid wins. Check that fuse and the relay before the motor.")
      ) +
      card("stop", "Gauge pegged", "Shut it off. Do not open a hot radiator cap. Do not spray the exhaust and call it a cooling repair. Orange iron is Guide 05, not this drawing.")
    ),
    tickglow: fig(
      "Tick, glow, and a hot gauge are three different things",
      "A cold tick that fades is a {{likely:LIKELY}} manifold-crack pattern, not proof this manifold is cracked. A glow is {{stop:STOP}}. Confirm a tick only when the iron is cool.",
      "diagram exhaust tick glow manifold overheat separate",
      row(
        card("stop", "Orange or red iron", "Stop driving. Do not spray water. Do not idle it to watch. Guide 05."),
        card("warn", "Cold tick, fades hot", "Look for soot, a broken stud, or a loose flange once it is cool. Not a reason to drive a glow."),
        card("test", "Temp gauge high", "Cooling page. Coolant, fans, thermostat. Not a cracked manifold by itself.")
      )
    ),
    exhaust: fig(
      "Four sensors. California layout as stated.",
      "Bank 1 is the front three cylinders. Bank 2 is the rear three. {{likely:LIKELY}} Sensor 2/2 is the P0161 bung. Count them on the truck. Sensors sit in the pipes, not in the cast manifold.",
      "diagram exhaust oxygen sensors mini cat p0161 bank",
      card("stop", "Manifold", "Passenger side is the usual 4.0 side. Confirm that on the truck. A glow here is a stop, not a parts order.") +
      down() +
      row(
        card("test", "Bank 1 · front", "1/1 upstream, then the front mini-cat, then 1/2 downstream."),
        card("warn", "Bank 2 · rear", "2/1 upstream, then the rear mini-cat, then 2/2. P0161 is 2/2 only.")
      ) +
      down() +
      card("plain", "Main cat", "After the branches join. Do not cut a catalyst out as a test.") +
      note("Do not swap sensors. Two sensors means the federal layout. Four means the California layout. Purchase state does not decide it.")
    ),
    oilpaths: fig(
      "Where fresh oil usually starts",
      "Places are {{likely:LIKELY}} until the new wet line names one. Rear main is last. This is not the tick and not the glow.",
      "diagram oil leak valve cover filter adapter sender pan rear main",
      card("stop", "Degrease cold", "Do not degrease a hot pipe. Solvent on hot iron is another fire.") +
      down() +
      row(
        card("warn", "Look here first", "Valve-cover rail. Filter-adapter O-rings. Oil-pressure sender. Pan rail."),
        card("plain", "Rear main last", "Only after the adapter, the pan, and the sender are ruled out. Do not install a new oxygen sensor into an oil spray.")
      )
    ),
    blower: fig(
      "Only on high is the resistor",
      "High speed bypasses the resistor. {{likely:LIKELY}} A blend-door click is not a heater core. Blower fuse cavity 1 is {{stated:CHART}}.",
      "diagram blower resistor blend door only on high",
      row(
        card("test", "Speeds 1–3", "Through the resistor on the HVAC case, passenger side. Confirm the connector. A melted plug gets a new plug and a new resistor. Do not twist the wires together."),
        card("plain", "High only", "Bypasses the resistor. If high works and the others do not, start there.")
      ) +
      row(
        card("warn", "No speeds at all", "Chart cavity 1 is the 40A blower fuse. Lid wins. Then the relay and the switch."),
        card("plain", "Click, wrong temperature", "Blend-door actuator. A wet sweet passenger floor is the heater core, which is a different job.")
      )
    ),
    trans42: fig(
      "4.0 means 42RE until the sticker says otherwise",
      "The 4.7 used the 45RFE. {{likely:LIKELY}} by engine. Confirm the door sticker. ATF+4 and the hot Neutral level check are {{likely:LIKELY}}. The owner manual wins.",
      "diagram 42re transmission atf dipstick neutral",
      row(
        card("good", "This engine", "4.0L WJ was built with the 42RE. Do not buy a 45RFE solenoid pack for it."),
        card("stop", "The other engine", "4.7 and the 45RFE. Chart words that say 4.7 TCM do not apply until the sticker says 4.7.")
      ) + note("Level check people use: hot, running, Neutral, brake set, level ground. Do not overfill it to hide a flare. A flare is not an IAC problem.")
    ),
    tcase: fig(
      "Read the bezel before you name the case",
      "NP231 or NP242. {{test:TEST REQUIRED}} This drawing does not assign one. Dry-pavement 4 High binds a part-time case.",
      "diagram transfer case command-trac selec-trac np231 np242",
      row(
        card("warn", "Command-Trac", "Part-time. 2 High, 4 High, Neutral, 4 Low on a typical bezel. Not for dry pavement in 4 High."),
        card("test", "Selec-Trac", "The full-time option. The bezel has a range the part-time case does not. That range is the one that can be used on pavement.")
      ) + note("The words on the shifter win. Do not order a chain or a pump until you know which case is in the truck. Towing on all four tires needs the owner manual for that case.")
    ),
    ps: fig(
      "Power steering is not a vacuum hose",
      "Do not pull these lines while chasing idle. Fluid on the exhaust is its own fire risk. The cap names the fluid.",
      "diagram power steering hose pump not vacuum",
      card("stop", "Leave the hoses on", "They are not on the vacuum map. A heavy wheel or a groan is the pump, the belt, the level, or the box.") +
      note("If the manifold is glowing, stop. Guide 05. Degrease steering fluid only when the iron is cold.")
    ),
    wobble: fig(
      "Death wobble is a pattern",
      "A loose track bar or a wallowed bracket is {{likely:LIKELY}} involved. It is not the only part. A stabilizer hides the shake.",
      "diagram death wobble track bar drag link solid axle",
      row(
        card("warn", "Look here first", "Track bar, both ends, and the frame bracket. Tires on the ground. Engine off. A helper moves the wheel a few inches. Play you can see is the fault."),
        card("plain", "Also on the list", "Drag-link ends, ball joints, control-arm bushings, tire balance, a bent wheel.")
      ) +
      card("stop", "Stabilizer", "It can hide the shake. It does not remove the play. No torque is printed on this drawing. Use a WJ spec, not a 2005+ spec.")
    ),
    booster: fig(
      "Booster hose versus a soft pedal",
      "A hard pedal and a hiss can be the same leak that raises idle. {{test:TEST REQUIRED}} Do not pinch that hose if it is your only brake.",
      "diagram brake booster vacuum hose hard pedal",
      card("test", "Booster → hose and check valve → intake", "A leak here raises idle on this MAP engine and can harden the pedal. Wheels chocked before any pinch test.") +
      down() +
      card("stop", "Pedal to the floor", "Fluid, air, or a leak at a wheel or the master. Not a vacuum leak. Do not drive it.")
    ),
    absring: fig(
      "ABS light. One wheel is not four sensors.",
      "Scan the ABS controller. A generic OBD reader often cannot see those codes. Fuse rows are on the fuse pages. {{stated:CHART}} where the charts named them. The cover and the lid win.",
      "diagram abs wheel speed sensor tone ring",
      card("test", "Read the code first", "A code for one wheel is that sensor, that tone ring, or that wire. Rings collect rust and metal dust.") +
      note("A pump that buzzes and never stops is a different fault. Disconnecting the battery does not fix either one.")
    ),
    window: fig(
      "One window, or all of them",
      "A broken wire in the door boot is a {{likely:LIKELY}} find on one dead window. Cavity 12 is a conflict and is not given a job on this drawing.",
      "diagram power window door boot harness",
      row(
        card("test", "One window dead", "Switch, then the harness in the door boot, then the motor. Listen for a click before you buy the motor."),
        card("warn", "Every window dead", "A shared feed or a ground. Not four motors. Read the under-hood lid. Do not install a 50A fuse from a chart the lid does not agree with.")
      )
    ),
    lamps: fig(
      "One bulb, or a whole pair",
      "Owner-chart cavities are on the driver-side page. {{stated:PUBLISHED}} The cover wins. Do not upsize a fuse that keeps opening.",
      "diagram headlamp one bulb both beams fuse relay",
      row(
        card("plain", "One lamp out", "Bulb or socket."),
        card("test", "Both low beams, or both high beams", "Fuse, relay, or the switch. Headlamp relays are named on the cover you are holding.")
      )
    ),
    horn: fig(
      "Horn. Stop if the airbag light is on.",
      "Mini 18 and relay R9 are {{stated:CHART}}. The lid wins. The clock spring is an airbag part. Do not pull the wheel as a test.",
      "diagram horn relay clock spring airbag",
      card("test", "Fuse and relay first", "Chart: under-hood mini 18, relay R9. A horn that works when that relay is jumped, and not from the wheel, is the switch or the clock spring.") +
      card("stop", "Airbag light on with a dead horn", "Leave the wheel on. That is a restraint job with a procedure and a battery wait, not a fuse experiment.")
    ),
    breaker: fig(
      "C1 clicks. That is the design.",
      "Owner chart: C1 is a 20A wiper breaker. {{stated:PUBLISHED}} Do not replace it with a fuse. Wiper relays R4 and R5 are {{stated:CHART}} in the under-hood box.",
      "diagram wiper circuit breaker c1",
      card("warn", "Breaker, not a fuse", "It opens and resets. A wiper that runs and then dies is often a dry linkage or a stalled motor tripping C1.") +
      note("Washer motors are interior 29 on the owner chart. A dead rear wiper is not automatically a front-motor job.")
    ),
    radio: fig(
      "Radio feeds. IOD wipes the presets.",
      "Owner chart. {{stated:PUBLISHED}} The cover wins. An amplifier is optional. A dead lighter is not a new radio.",
      "diagram radio amplifier fuse outlets iod presets",
      row(
        card("test", "Cavity 30 · radio", "15A. No display often starts here, or the IOD fuse was pulled and the keep-alive died."),
        card("test", "Cavity 5 · amp", "25A, radio and amplifier. Display on and no sound can be the amp, not the radio."),
        card("plain", "Outlets and cigar", "Cavity 9 is the outlets, 20A. Cavity 26 is the cigar lighter, 15A. Do not probe a socket with a screwdriver.")
      )
    )
  };
})();

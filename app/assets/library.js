/* Field library for this WJ only. Not a factory manual. The lid and the cover win. */
window.STEPHS_LIB = {
  groups: [
    { id: "here", title: "Already on this truck" },
    { id: "power", title: "Fuses and power" },
    { id: "run", title: "Start, charge, run" },
    { id: "heat", title: "Heat, cooling, air" },
    { id: "drive", title: "Drivetrain" },
    { id: "chassis", title: "Steering and brakes" },
    { id: "body", title: "Body electrics" }
  ],
  pages: [
    {
      id: "three",
      code: "3",
      group: "here",
      title: "Three problems, still separate",
      blurb: "Idle, oil-fire, and P0161. This library does not merge them.",
      kicker: "This truck · do not collapse the story",
      find: "glow oil p0505 p0161 idle pintle heater separate chains",
      blocks: [
        { t: "p", text: "The idle chain, the oil-on-exhaust fire hazard, and P0161 stay three problems. A page in this library does not turn them into one diagnosis. If the manifold is glowing or oil is on the exhaust, the hazard buttons at the top still lock the repair steps." },
        { t: "card", kind: "stop", title: "Glow is Guide 05", text: "Bright orange or red iron: stop driving, do not spray water, do not idle it to watch, tow if it has to move. A cold tick is a different page. Overheat on the temp gauge is a different page." },
        { t: "card", kind: "stop", title: "Oil is Guide 06", text: "Oil on hot iron or on an oxygen sensor can ignite. Degrease cold. Trace fresh oil. That chain is not the idle chain and not P0161." },
        { t: "card", kind: "test", title: "P0161 is the heater circuit only", text: "Bank 2 Sensor 2, rear downstream. The walk still refuses to name a fuse cavity. The fuse charts in this library do not overrule that. Meter the cavity the lid names, then go back to the walk." },
        { t: "jump", act: "goto", mode: "walk", tree: "p0505", label: "Walk P0505" },
        { t: "jump", act: "goto", mode: "walk", tree: "p0161", label: "Walk P0161" },
        { t: "jump", act: "mode", mode: "order", label: "Open the repair order" },
        { t: "guide", id: "05", label: "Open Guide 05, glowing manifold" },
        { t: "guide", id: "06", label: "Open Guide 06, oil and fire" }
      ]
    },
    {
      id: "how",
      code: "HOW",
      group: "power",
      title: "How to test a fuse",
      blurb: "Look is not a test. Same amp, same body. Do not upsize.",
      kicker: "Power · test the fuse you can name",
      find: "fuse test ohms voltage puller mini atm jcase breaker upsize short",
      blocks: [
        { t: "p", text: "A fuse can look intact and be open. Measure it, or measure voltage on both sides with the circuit powered. This page is the method. The cavity numbers live on the under-hood page and the driver-side page, and the label in the truck wins over both." },
        { t: "h", text: "Do this" },
        { t: "ol", items: [
          "Key off before you pull a fuse. Write down the cavity. Do not pull a handful and trust memory.",
          "Use a fuse puller. Pliers crush the blades and the plastic.",
          "Measure ohms across the two blades, out of the block. A good fuse is a short, near 0 ohms. OL is open.",
          "Or leave it in, power the circuit, and measure voltage on both sides. Battery voltage on the feed and nothing on the load means the fuse is open.",
          "Replace with the same amp and the same body. A mini blade (ATM) does not fit a cartridge (JCase) slot. A higher amp is not a repair.",
          "If the new fuse opens as soon as you use the circuit, stop. Find the short. Do not keep feeding it.",
          "Circuit breakers (wipers and seats on the driver-side cover) click and reset. A clicking breaker is a stalled motor or a short, not a cue to install a bigger fuse."
        ] },
        { t: "card", kind: "stop", title: "Do not upsize", text: "The number on the fuse is the limit that protects the wire. A 20 in a 10 cavity can burn the harness and still leave the real fault in place." },
        { t: "card", kind: "test", title: "Three bodies in this truck", text: "Under the hood: large cartridge fuses and small mini fuses, plus ISO relays. Driver side: mini fuses and two circuit breakers. The 2004 owner manual says the under-hood box holds cartridges, minis, and ISO relays. {{stated:PUBLISHED}}" },
        { t: "links", items: [
          ["https://www.amazon.com/s?k=automotive+fuse+puller", "Amazon search: fuse puller"],
          ["https://www.amazon.com/s?k=ATM+mini+automotive+fuse+assortment", "Amazon search: ATM mini fuses"],
          ["https://www.amazon.com/s?k=JCase+cartridge+fuse+assortment", "Amazon search: JCase cartridges"],
          ["https://www.amazon.com/s?k=digital+multimeter", "Amazon search: digital multimeter"]
        ] },
        { t: "p", text: "A search is not the fuse printed on your lid. Buy the amp and the body the label names. Do not buy a whole power-distribution center because one fuse was open." },
        { t: "go", id: "pdc", label: "Under-hood fuse box" },
        { t: "go", id: "junction", label: "Driver-side fuse box" }
      ]
    },
    {
      id: "pdc",
      code: "PDC",
      group: "power",
      title: "Under-hood fuse box",
      blurb: "PDC by the battery. Lid wins. Not a 2005+ WK diagram.",
      kicker: "Power · power distribution center",
      find: "pdc under hood underhood power distribution cartridge jcase relay asd fuel pump horn fan iod oxygen injector blower abs",
      blocks: [
        { t: "p", text: "The under-hood power distribution center sits by the battery. The 2004 owner manual says it holds cartridge fuses, mini fuses, and ISO relays, and that the lid label identifies each one. Read that lid. If this chart and the lid disagree, the lid wins." },
        { t: "card", kind: "stop", title: "This is a WJ, 1999–2004", text: "Do not use a 2005 and later WK diagram. Those trucks use an IPM or TIPM. This one does not. Do not copy a diesel cavity onto this 4.0. Sites that label a 2004 Grand Cherokee as a WK are the wrong truck." },
        { t: "p", text: "The rows below are a gasoline WJ service compilation. Two public charts agreed on these jobs. That is {{stated:CHART}}, not a line-by-line copy of the owner manual, except where the owner manual itself numbered a cavity. The only under-hood cavity the 2004 owner manual numbered in the pages used here is cartridge 15, Ignition-Off Draw." },
        { t: "h", text: "Cartridge and mini fuses" },
        { t: "table", caption: "Under-hood PDC. CHART unless the row says otherwise. Lid wins. Amp is what the charts print, not a guess.",
          heads: ["Cavity", "Amp", "What the charts assign", "Label"],
          rows: [
            ["1", "40A", "Blower motor", "{{stated:CHART}}"],
            ["2", "40A", "Rear defogger relay and cigar-lighter relay feed", "{{stated:CHART}}"],
            ["3", "50A", "Headlamp relays, plus some interior lamp fuses", "{{stated:CHART}}"],
            ["4", "40A", "ABS", "{{stated:CHART}}"],
            ["5", "30A", "Transmission. Charts say 4.0 solenoid / 4.7 TCM. This package is a stated 4.0. Do not buy a 4.7 module from this row.", "{{stated:CHART}}"],
            ["6", "30A", "ASD, gasoline. Charts say ignition coils, capacitor, and PDC fuses 16 and 26. Not the only heater fuse. See the note under the table.", "{{stated:CHART}}"],
            ["7", "50A", "Feed for interior fuses 23, 24, 25, 27 and seat breaker C2", "{{stated:CHART}}"],
            ["8", "40A", "Starter relay and ignition-switch feed. Charts name interior 12, 21, 22, 28, 29, 30, 32 and breaker C1.", "{{stated:CHART}}"],
            ["9", "—", "Not assigned on this 4.0. Charts put diesel or an empty slot here.", "{{no:NOT THIS ENGINE}}"],
            ["10", "40A", "Radiator fan on the 4.0", "{{stated:CHART}}"],
            ["11", "—", "Not assigned on this 4.0. Charts put diesel or an empty slot here.", "{{no:NOT THIS ENGINE}}"],
            ["12", "50A on both charts", "The charts disagree. One says door modules and interior fuse 18. Another says power windows. No single job is printed here.", "{{no:CONFLICT}}"],
            ["13", "—", "Not assigned on this 4.0. Charts put diesel or storage here.", "{{no:NOT THIS ENGINE}}"],
            ["14", "40A", "Ignition switch. Charts name interior 19, 20, 31, and 33.", "{{stated:CHART}}"],
            ["15", "50A", "Charts: feed for interior fuses 5, 7, 8, and 9. The 2004 owner manual tells you to pull cartridge 15, labeled Ignition-Off Draw, if the truck sits more than 21 days. Same cavity number, two descriptions. Match the lid.", "{{stated:OWNER + CHART}}"],
            ["16", "15A", "Oxygen sensors. Charts split by year: 1998–2000 sensors only; 2001–2004 sensors plus the downstream oxygen-sensor relay. This is a 2004, so the later sentence is the one to compare with the lid. Still not the only heater fuse.", "{{stated:CHART}}"],
            ["18", "15A", "Horn", "{{stated:CHART}}"],
            ["19", "10A", "PCM", "{{stated:CHART}}"],
            ["20", "—", "Spare on the gasoline charts", "{{stated:CHART}}"],
            ["21", "15A", "A/C clutch", "{{stated:CHART}}"],
            ["22", "—", "Spare on the gasoline charts", "{{stated:CHART}}"],
            ["23", "—", "Spare on the gasoline charts", "{{stated:CHART}}"],
            ["24", "20A", "Fuel pump", "{{stated:CHART}}"],
            ["25", "20A", "ABS", "{{stated:CHART}}"],
            ["26", "15A", "Fuel injectors, gasoline", "{{stated:CHART}}"],
            ["27", "—", "Spare on the gasoline charts", "{{stated:CHART}}"],
            ["28", "15A", "4.0 transmission solenoid", "{{stated:CHART}}"]
          ] },
        { t: "card", kind: "test", title: "Do not pick the heater fuse from this table", text: "Charts put ASD on cartridge 6, oxygen sensors on mini 16, and the driver-side cover prints fuse 12 as the auto shut down relay / Fuel. That is three published names on one path. The P0161 walk still says no fuse number is printed there. Measure the cavity the lid names for the circuit you are on. A shorted heater can open the fuse. A good-looking fuse can still be open." },
        { t: "h", text: "Relays in the same box" },
        { t: "p", text: "Relay positions below are from the same gasoline compilation. {{stated:CHART}} The lid wins. Swap a relay only with one the lid shows as the same type. R11 and R12 are diesel glow-plug relays. They are not this engine." },
        { t: "table", caption: "PDC relays, gasoline chart only.",
          heads: ["Position", "Chart name", "Label"],
          rows: [
            ["R1", "Fuel pump", "{{stated:CHART}}"],
            ["R2", "Starter", "{{stated:CHART}}"],
            ["R3", "TCM relay. Do not treat this as proof the truck has a 4.7 controller.", "{{stated:CHART}}"],
            ["R4", "Wiper on/off", "{{stated:CHART}}"],
            ["R5", "Wiper high/low", "{{stated:CHART}}"],
            ["R6", "Downstream oxygen sensors", "{{stated:CHART}}"],
            ["R7", "Upstream oxygen sensors", "{{stated:CHART}}"],
            ["R8", "A/C clutch", "{{stated:CHART}}"],
            ["R9", "Horn", "{{stated:CHART}}"],
            ["R10", "ASD", "{{stated:CHART}}"],
            ["R11", "Diesel glow. Not this engine.", "{{no:NOT THIS ENGINE}}"],
            ["R12", "Diesel glow. Not this engine.", "{{no:NOT THIS ENGINE}}"]
          ] },
        { t: "card", kind: "poss", title: "Do not buy a new PDC first", text: "One open fuse or one dead relay is a fuse or a relay. Clean grounds before a module. An internal board fault in the PDC is a {{likely:LIKELY}} pattern only after a single fuse, a single relay, and the grounds have been measured and the fault is still inside the box." },
        { t: "go", id: "how", label: "How to test a fuse" },
        { t: "go", id: "junction", label: "Driver-side fuse box" },
        { t: "go", id: "iod", label: "IOD and a dead battery" },
        { t: "jump", act: "goto", mode: "walk", tree: "p0161", label: "P0161 walk, fuse step still unnamed" }
      ]
    },
    {
      id: "junction",
      code: "CAB",
      group: "power",
      title: "Driver-side fuse box",
      blurb: "Junction block left of the column. 2004 owner chart. Cover wins.",
      kicker: "Power · interior junction block",
      find: "junction block interior fuse driver side steering column cabin fuse box radio wiper breaker cigar outlet airbag ignition",
      blocks: [
        { t: "p", text: "The interior junction block is in the lower instrument panel, just left of the steering column. The cover has a stamped label. That stamp wins. If a row here and the cover disagree, follow the cover and write down what it says." },
        { t: "p", text: "This table is the 2004 owner manual interior chart, about pages 287–288. Two viewers agreed on these rows. {{stated:PUBLISHED}} Cavity 18 is 30A trailer tow. Its color was not on the pages used here, so this page does not invent one." },
        { t: "h", text: "Fuses and breakers" },
        { t: "table", caption: "Driver-side junction block. 2004 owner manual. Cover wins.",
          heads: ["Cavity", "Amp", "Color on that chart", "What it feeds"],
          rows: [
            ["1", "—", "—", "Spare"],
            ["2", "—", "—", "Spare"],
            ["3", "10A", "Red", "High beam, left"],
            ["4", "15A", "Light blue", "Flasher"],
            ["5", "25A", "Natural", "Radio / amplifier"],
            ["6", "15A", "Light blue", "Park lights"],
            ["7", "10A", "Red", "Interior lights"],
            ["8", "15A", "Light blue", "Overhead console, rear wiper, instrument-panel lights, rear flipper-glass solenoid"],
            ["9", "20A", "Yellow", "Power outlets"],
            ["10", "20A", "Yellow", "Adjustable pedals"],
            ["11", "10A", "Red", "Rear-window defroster indicator"],
            ["12", "10A", "Red", "Auto shut down relay / Fuel. One name on the ASD path. Not permission to skip the under-hood lid."],
            ["13", "—", "—", "Spare"],
            ["14", "10A", "Red", "Low beam, left"],
            ["15", "10A", "Red", "Low beam, right"],
            ["16", "10A", "Red", "High beam, right"],
            ["17", "10A", "Red", "Instrument cluster and the diagnostic connector"],
            ["18", "30A", "Read the cover", "Trailer tow. Color was not extracted."],
            ["19", "10A", "Red", "Antilock brakes"],
            ["20", "10A", "Red", "Ignition run"],
            ["21", "10A", "Red", "Ignition run/start, PDC"],
            ["22", "10A", "Red", "Ignition run/start"],
            ["23", "15A", "Light blue", "Brake switch"],
            ["24", "15A", "Light blue", "Fog lamps"],
            ["25", "20A", "Yellow", "Accessory-delay relay (sunroof)"],
            ["26", "15A", "Light blue", "Cigar lighter"],
            ["27", "15A", "Light blue", "Rear fog lamps, if equipped"],
            ["28", "10A", "Red", "BCM accessory/run"],
            ["29", "10A", "Red", "Rear wiper switch and washer motors"],
            ["30", "15A", "Light blue", "Radio"],
            ["31", "10A", "Red", "Ignition start"],
            ["32", "10A", "Red", "Ignition run/start, airbag"],
            ["33", "10A", "Red", "Ignition run, airbag"],
            ["C1", "20A", "Breaker", "Wiper circuit breaker. It resets. Do not replace it with a fuse."],
            ["C2", "20A", "Breaker", "Seat circuit breaker. It resets. Do not upsize it."],
            ["C3", "—", "—", "Spare"]
          ] },
        { t: "card", kind: "test", title: "Fuse 12 is not the whole heater story", text: "The owner chart prints cavity 12 as the auto shut down relay / Fuel. The under-hood charts also name cartridge 6 and mini 16 on the ASD and oxygen-sensor path. Measure. Do not pick one cavity from a screen and call P0161 solved. Go back to the walk after the lid is read." },
        { t: "h", text: "Relays behind the same cover" },
        { t: "p", text: "The owner chart above is the fuse list. A service compilation, not the owner manual, also puts relays in this block: low beam / DRL, cigar, flasher, rear defrost, rear fog, low beam, high beam, sunroof, front fog, park lamp, and spares. {{stated:CHART}} The stamped cover names the ones this truck has. Do not assign a relay a job the cover does not print. Do not use a WK interior diagram." },
        { t: "card", kind: "stop", title: "Airbag fuses are 32 and 33", text: "Leave them alone unless you are testing that circuit on purpose, key off, with a procedure. They are not a battery-draw experiment and they are not a SKIM repair." },
        { t: "go", id: "pdc", label: "Under-hood fuse box" },
        { t: "go", id: "how", label: "How to test a fuse" },
        { t: "go", id: "lights", label: "Lamps" },
        { t: "go", id: "wipers", label: "Wipers" },
        { t: "jump", act: "goto", mode: "walk", tree: "p0161", label: "P0161 walk" }
      ]
    },
    {
      id: "iod",
      code: "IOD",
      group: "power",
      title: "Dead battery and IOD",
      blurb: "Storage pull versus a draw that kills it overnight.",
      kicker: "Power · Ignition-Off Draw",
      find: "iod ignition off draw parasitic drain dead battery storage fuse 15 presets clock",
      blocks: [
        { t: "p", text: "A battery that dies after the truck sits for weeks is a different job from a battery that dies overnight, and both are different from an alternator that will not charge on a drive. Split them before you buy parts." },
        { t: "card", kind: "test", title: "What the owner manual says", text: "If the truck will be stored more than 21 days, remove cartridge fuse 15 in the under-hood PDC, the one labeled Ignition-Off Draw. Radio presets and the clock are lost. Match the lid before you pull it. {{stated:PUBLISHED}}" },
        { t: "card", kind: "test", title: "A second description exists", text: "A service write-up says an IOD connector was moved from junction-block slot 15 to a storage slot. The owner manual instead says pull under-hood cartridge 15. Those are two published descriptions. Do not assume they are the same physical step. Match the label in your hand." },
        { t: "h", text: "If it dies in a day or two" },
        { t: "ol", items: [
          "Clean the posts and confirm the truck actually starts and runs long enough to charge before you call it a draw. A resting battery is usually about 12.4–12.7 V. {{likely:LIKELY}} screen, not a factory limit on these sheets. A reading right after shutdown is a surface charge and lies high.",
          "Key off. Close the doors. Wait until the modules sleep before you measure a draw. A lamp, a glovebox switch, an aftermarket radio on a constant feed, or a relay that stays clicked are the usual finds.",
          "Pull fuses one at a time only after you are measuring the draw, and put each one back. Do not pull airbag fuses 32 and 33 as a casual first try.",
          "If the draw is on the IOD feed, use the storage pull only as a storage tool. Find the circuit that is awake. Do not buy a PDC until one fuse or one circuit is proven."
        ] },
        { t: "p", text: "If it cranks weak right after a long drive, use the charging page. The alternator and the belt are ahead of a draw test." },
        { t: "go", id: "pdc", label: "Under-hood fuse box, cavity 15" },
        { t: "go", id: "charging", label: "Charging" },
        { t: "go", id: "radio", label: "Radio and outlets" }
      ]
    },
    {
      id: "grounds",
      code: "GND",
      group: "power",
      title: "Grounds",
      blurb: "Shared faults. Clean the cables you can see before a module.",
      kicker: "Power · grounds",
      find: "ground battery negative engine block voltage drop g101 corrosion",
      blocks: [
        { t: "p", text: "A bad battery-to-engine or battery-to-body ground makes the starter click, the gauges lie, and the alternator misbehave together. That pattern is one connection, not three parts." },
        { t: "ol", items: [
          "Follow the cables you can see. Battery negative to the body. Battery or block strap to the engine. A PCM ground that shares a stud. No ground number is printed on this page. Do not invent one.",
          "Clean both ends to metal. Tight. Green crust is not a connection.",
          "Voltage drop is the test. Meter from the battery negative post to the engine block while a helper cranks, and from the post to the body. More than about half a volt while cranking means clean that path. {{likely:LIKELY}} method, not a printed factory limit here.",
          "If several circuits die together, find the shared feed or the shared ground before you replace the parts on the list."
        ] },
        { t: "go", id: "nocrank", label: "No crank" },
        { t: "go", id: "charging", label: "Charging" }
      ]
    },
    {
      id: "nocrank",
      code: "NCR",
      group: "run",
      title: "No crank",
      blurb: "Battery, Park, starter relay, key wiggle, security light.",
      kicker: "Run · the starter never turns",
      find: "no crank click starter relay park neutral ignition switch key wiggle solenoid",
      blocks: [
        { t: "p", text: "No crank means the engine does not turn. A crank with no fire is the next page. A security light that stays on is the SKIM page. Do not buy a starter, a switch, and a PDC in one trip." },
        { t: "ol", items: [
          "Park, parking brake, wheels chocked. Try Neutral. A sloppy Park position is a {{likely:LIKELY}} no-crank on these trucks because the switch never sees Park.",
          "Battery and both ends of both cables. Dim lights and a click are a battery, a cable, or a ground. Rapid clicking is low voltage. One solid click and then nothing can be the solenoid or a battery that collapses.",
          "Starter relay. The under-hood chart calls it R2. {{stated:CHART}} The lid wins. Swap only with a relay the lid shows as the same type.",
          "Owner-chart ignition fuses: 20 run, 21 run/start PDC, 22 run/start, 31 start. Under-hood cartridges 8 and 14 are on the ignition-switch feed in the service chart. Measure the one the lid names. Do not guess.",
          "If wiggling the key changes whether it cranks, the fault is {{likely:LIKELY}} the ignition switch on the column. The switch and the lock cylinder are different parts. Do not buy a PDC for a key-wiggle."
        ] },
        { t: "card", kind: "stop", title: "Jumping the starter is only a test", text: "Park, chocked, everyone clear of the fan and the belt. It bypasses the switch. It does not find the cause. Do not do it while the security light is on." },
        { t: "go", id: "grounds", label: "Grounds" },
        { t: "go", id: "skim", label: "Security light" },
        { t: "go", id: "cranks", label: "Cranks, will not fire" },
        { t: "go", id: "junction", label: "Driver-side ignition fuses" }
      ]
    },
    {
      id: "cranks",
      code: "RUN",
      group: "run",
      title: "Cranks, will not fire",
      blurb: "Pump, ASD, spark, injectors. No starting fluid on a glow.",
      kicker: "Run · it turns, it does not catch",
      find: "crank no start fuel pump asd spark injector noid prime relay",
      blocks: [
        { t: "p", text: "The engine turns and does not catch. Split fuel from spark before you buy a sensor. This 4.0 has a coil rail and no distributor. Timing is not a wrench adjustment. {{conf:CONFIRMED}} on this package." },
        { t: "ol", items: [
          "Key on, engine off. Listen at the tank for a one-to-two-second pump prime. The chart says PDC mini 24 is the 20A fuel-pump fuse and R1 is the pump relay. {{stated:CHART}} Lid wins. No prime: that fuse, that relay, the pump, or the feed. Prove which.",
          "No spark and no injector pulse together points at ASD, the crank signal, or the PCM feed. The chart says cartridge 6 is ASD on gasoline and R10 is the ASD relay, feeding the coils and the injectors. {{likely:LIKELY}} on this WJ. Prove it with a spark tester or a noid light. Do not pierce wires.",
          "A steady key-on reading of 0 V on an ASD feed can be the relay already dropped out. Check during the prime, while cranking, or running.",
          "Cam or crank signal missing means no spark. The hot-stall page is that pattern. A new crank sensor is not the first part if you have not heard the pump or checked the ASD fuse the lid names."
        ] },
        { t: "card", kind: "stop", title: "No starting fluid on a hazard", text: "Do not spray starting fluid if the manifold has glowed or oil is on the exhaust. Turn the hazard on. Guides 05 and 06. This page does not override them." },
        { t: "go", id: "hotstall", label: "Hot stall / crank sensor" },
        { t: "go", id: "pdc", label: "Under-hood fuse box" },
        { t: "go", id: "coil", label: "Coil rail and misfire" },
        { t: "jump", act: "mode", mode: "order", label: "Repair order, if a hazard is on" }
      ]
    },
    {
      id: "hotstall",
      code: "HOT",
      group: "run",
      title: "Hot stall, then it restarts",
      blurb: "Crank sensor pattern. Wiring campaign number is not confirmed here.",
      kicker: "Run · dies hot, catches again when cool",
      find: "crank sensor cps hot stall cam sensor bellhousing restart no spark dies hot",
      blocks: [
        { t: "p", text: "Pattern: it runs, dies hot, cranks and will not catch, then starts after it cools. On the 4.0 that pattern is a {{likely:LIKELY}} crank-sensor fault. The sensor, the connector, and the wiring all count. The sensor sits on the bellhousing. Confirm the plug in your hand is that sensor." },
        { t: "ol", items: [
          "Do not buy a sensor, a PCM, and an ASD relay together. Rule out the no-fire page first if it never restarts when cool: pump, ASD fuse, spark.",
          "When it is hot and dead, a careful wiggle of the crank-sensor connector can bring it back. Only with a helper, and only if you can stay clear of the fan, the belt, and the exhaust. If moving the connector changes it, repair the connection before you buy the sensor.",
          "The cam sensor is the other signal. On this engine it sits where a distributor used to be, in the oil-pump drive. {{likely:LIKELY}} location. Confirm the plug. It is not the same part as the crank sensor. A bad cam sensor can no-start. It is not the hot-stall pattern by itself.",
          "No part number on this page. Match a crank sensor or a cam sensor by VIN. The 4.0 plug is not the 4.7 plug."
        ] },
        { t: "card", kind: "test", title: "Look the VIN up before a recall story", text: "A 2004 4.0 crank-sensor wiring campaign has been mentioned in parts listings. The campaign number is {{no:NOT CONFIRMED}} on this page. Do not buy parts because a listing quoted a number. Look this VIN up." },
        { t: "links", items: [
          ["https://www.nhtsa.gov/recalls", "NHTSA recall lookup for this VIN"]
        ] },
        { t: "go", id: "cranks", label: "Cranks, will not fire" },
        { t: "go", id: "coil", label: "Coil rail, if it misfires but keeps running" }
      ]
    },
    {
      id: "charging",
      code: "ALT",
      group: "run",
      title: "Charging",
      blurb: "Belt, posts, then the alternator. Not a new PDC.",
      kicker: "Run · battery light, dim lamps, weak after a drive",
      find: "alternator charging battery voltage belt battery light 14 volts posts",
      blocks: [
        { t: "p", text: "The alternator does not charge if the belt is gone. Look at the belt before you condemn the alternator. A battery that dies after sitting for days is the IOD page, not this one." },
        { t: "ul", items: [
          "Key off, after a rest: usually about 12.4–12.7 V at the posts. {{likely:LIKELY}} screen, not a factory limit here. Right after shutdown reads higher because of surface charge.",
          "Running: usual screen about 13.5–14.5 V at the battery. {{likely:LIKELY}} Under about 13 V running, with loads on: belt, the alternator plug, the heavy charge cable, the grounds, then the alternator.",
          "Clean both posts to bright metal. Corrosion is a connection fault and it mimics a bad alternator.",
          "Do not replace the PDC because the gauge reads low."
        ] },
        { t: "go", id: "belt", label: "Serpentine belt" },
        { t: "go", id: "grounds", label: "Grounds" },
        { t: "go", id: "iod", label: "Dies while parked" }
      ]
    },
    {
      id: "skim",
      code: "KEY",
      group: "run",
      title: "Security light",
      blurb: "SKIM immobilizer. The other key first. Not a starter.",
      kicker: "Run · SKIM",
      find: "skim security light immobilizer transponder key no start starts and dies",
      blocks: [
        { t: "p", text: "A security light that stays on, with a no-start or a start-and-stall, is the immobilizer. It is not a dead starter and it is not an ASD fuse. The truck can crank or it can fire and die. Read which one you have." },
        { t: "ol", items: [
          "Try the other key. A worn key or a missing transponder pellet fails this truck and does not fail the starter.",
          "Do not keep cranking. Do not buy a PCM as the first part. No SKIM part number is printed here. A shop with the right tool can read it.",
          "Interior fuses 32 and 33 are the airbag ignition feeds on the owner chart. They are not a SKIM repair. Leave the airbag circuit alone.",
          "If the security light is off and the engine still will not turn, use the no-crank page."
        ] },
        { t: "go", id: "nocrank", label: "No crank" },
        { t: "go", id: "cranks", label: "Cranks, will not stay running" }
      ]
    },
    {
      id: "coil",
      code: "COIL",
      group: "run",
      title: "Coil rail and misfire",
      blurb: "No plug wires. No distributor. One miss is not a new rail yet.",
      kicker: "Run · ignition",
      find: "coil rail misfire plug no distributor no plug wires boot oil in well",
      blocks: [
        { t: "p", text: "Coil rail, no plug wires, no distributor. {{conf:CONFIRMED}} One rail covers the plugs. A single-cylinder misfire can be the plug, the boot, the connector, the injector, or low compression. Do not buy a rail because one cylinder is named in a code." },
        { t: "ol", items: [
          "Swap one plug only as a test, and only when the manifold is cool and the plug well is not full of oil. If the miss moves with the plug, the plug moved. If it stays, keep looking.",
          "Oil in a plug well is the oil chain, not a coil. Fix the leak. Do not fire a plug that is sitting in oil.",
          "No plug number and no gap on this page. Match by VIN. Do not buy NTK 23142 from this package. That number did not confirm, and it is not a plug."
        ] },
        { t: "card", kind: "stop", title: "A misfire can glow the manifold", text: "If the iron is orange or red, stop. This page is not the emergency. Guide 05. Key off. Do not keep revving it to hear the miss." },
        { t: "guide", id: "05", label: "Open Guide 05" },
        { t: "go", id: "three", label: "Three problems, kept apart" },
        { t: "go", id: "cranks", label: "No spark at all" }
      ]
    },
    {
      id: "belt",
      code: "BELT",
      group: "run",
      title: "Serpentine belt",
      blurb: "One belt. If it shreds, you lose charge, steering assist, and pump flow.",
      kicker: "Run · belt",
      find: "serpentine belt tensioner idler squeal shreds power steering water pump",
      blocks: [
        { t: "p", text: "One belt runs the accessories. If it shreds: no charge, no power steering, no water-pump flow. Pull over. Do not keep driving it hot. The electric radiator fan is separate and does not save a missing belt." },
        { t: "ul", items: [
          "A belt that walks off is often a seized idler or a cocked tensioner, not a belt that was an inch too short.",
          "The 4.0 viscous fan is on the water pump. The electric fan is the one on the radiator. Do not confuse them when you buy a clutch.",
          "No belt part number here. Read the number printed on the old belt if it is still legible. Match a 4.0, not a 4.7. A search is not fitment.",
          "Stay clear of a running belt. Do not feel for tension with the engine running."
        ] },
        { t: "links", items: [
          ["https://www.amazon.com/s?k=2004+Jeep+Grand+Cherokee+4.0+serpentine+belt", "Amazon search: 2004 4.0 serpentine belt"]
        ] },
        { t: "go", id: "charging", label: "Charging" },
        { t: "go", id: "cooling", label: "Cooling and the two fans" },
        { t: "go", id: "ps", label: "Power steering" }
      ]
    },
    {
      id: "cooling",
      code: "FAN",
      group: "heat",
      title: "Cooling and the two fans",
      blurb: "Viscous clutch plus an electric fan. Overheat is not a glowing manifold.",
      kicker: "Heat · temp gauge",
      find: "overheat radiator fan viscous clutch thermostat coolant temperature gauge electric fan",
      blocks: [
        { t: "card", kind: "stop", title: "A pegged gauge is a shutdown", text: "Shut it off. Do not open a hot radiator cap. Do not spray water on a hot exhaust manifold and call that a cooling repair. A glowing manifold is Guide 05, not this page." },
        { t: "p", text: "This 4.0 has a mechanical viscous fan on the water pump and an electric radiator fan. The electric fan is for the A/C and for extra cooling. The chart says under-hood cavity 10 is a 40A radiator-fan fuse on the 4.0, with a fan relay in that box. {{stated:CHART}} The lid wins." },
        { t: "ul", items: [
          "A/C on, electric fan never runs: that fuse and the relay before the fan motor.",
          "Gauge climbs in traffic and the viscous clutch never roars when it is hot: the clutch is a {{likely:LIKELY}} suspect. A clutch that is locked all the time roars even when cold.",
          "The usual 4.0 thermostat people buy is about 195°F. {{likely:LIKELY}} Match the VIN. A thermostat does not fix a cracked manifold or a glow.",
          "Heater hoses are not vacuum hoses. Do not pull them while chasing idle.",
          "Coolant on the ground, traced cold: water-pump weep hole, radiator end tank, hoses, or a heater core if the passenger floor is wet and sweet. No part numbers on this page."
        ] },
        { t: "go", id: "crack", label: "Cold exhaust tick" },
        { t: "go", id: "hvac", label: "Blower and heat" },
        { t: "go", id: "pdc", label: "Fan fuse on the PDC chart" },
        { t: "guide", id: "05", label: "Open Guide 05 if the manifold is glowing" }
      ]
    },
    {
      id: "crack",
      code: "TICK",
      group: "heat",
      title: "Cold exhaust tick",
      blurb: "Manifold crack pattern. Not the glow emergency. Not the oil fire.",
      kicker: "Heat · exhaust manifold",
      find: "exhaust tick manifold crack cold tick broken stud fades hot",
      blocks: [
        { t: "p", text: "A tick that is loud when cold and fades as it warms is a known 4.0 manifold pattern, often a cracked runner or a broken stud. {{likely:LIKELY}} as a pattern. It is not proof this manifold is cracked. Confirm it cold: soot at a seam, a broken stud, a loose flange." },
        { t: "card", kind: "stop", title: "A tick is not a glow", text: "If the iron is orange or red, stop and use the glow hazard. Do not drive a glowing manifold to see if the tick goes away. Guide 05." },
        { t: "card", kind: "stop", title: "A tick is not the oil fire", text: "Oil on the pipe smells and smokes. A crack ticks. Both can be true. Keep them on separate pages. Guide 06 if oil is reaching the iron." },
        { t: "p", text: "Repair is the manifold and the hardware after it is cool enough to inspect, and only after you can see the crack. No manifold part number here. Match the 4.0 passenger-side manifold by VIN. Broken studs are common. Do not cut a catalyst out because of a tick." },
        { t: "guide", id: "05", label: "Open Guide 05" },
        { t: "guide", id: "06", label: "Open Guide 06" },
        { t: "jump", act: "goto", mode: "bench", map: "exhaust", node: "manifold", label: "Exhaust map, manifold" }
      ]
    },
    {
      id: "hvac",
      code: "HVAC",
      group: "heat",
      title: "Blower, blend door, A/C clutch",
      blurb: "Only-on-high is the resistor. A dash click is not a heater core.",
      kicker: "Heat · HVAC",
      find: "blower resistor only on high blend door actuator heater core ac clutch vacuum elbow",
      blocks: [
        { t: "p", text: "Blower works only on high: {{likely:LIKELY}} the resistor or its connector. High speed bypasses the resistor. Lower speeds go through it. On the WJ the resistor is on the HVAC case, passenger side. Confirm the connector you unplug. A melted plug means replace the plug and the resistor. Do not twist the bare wires together." },
        { t: "ul", items: [
          "No blower at any speed: under-hood blower fuse first. Chart cavity 1 is 40A. {{stated:CHART}} Lid wins. Then the relay and the switch. Not a resistor.",
          "Hot and cold will not change, or a click under the passenger dash: blend-door actuator. {{likely:LIKELY}} pattern. Do not buy a heater core for a click.",
          "Wet passenger floor and a sweet smell: heater core. Different job from the actuator. No part number here.",
          "A/C clutch: chart mini 21 is 15A and relay R8. {{stated:CHART}} Lid wins. A clutch that will not pull in is that fuse, the relay, a pressure switch, or the charge. Do not vent refrigerant."
        ] },
        { t: "card", kind: "test", title: "The vacuum elbow is a different fault", text: "The HVAC vacuum elbow on the hose map can collapse and kill HVAC or cruise vacuum. That is not a high-idle fix. Do not buy 55115901AG to cure P0505. A cracked elbow of the same age can leak. Open the hose map." },
        { t: "jump", act: "goto", mode: "bench", map: "hoses", node: "hvac", label: "HVAC elbow on the hose map" },
        { t: "go", id: "pdc", label: "Blower fuse and A/C clutch fuse" }
      ]
    },
    {
      id: "trans",
      code: "42R",
      group: "drive",
      title: "42RE transmission",
      blurb: "The 4.0 was built with the 42RE. Confirm the door sticker.",
      kicker: "Drivetrain · automatic",
      find: "42re 45rfe transmission solenoid atf flare dipstick neutral door sticker tcm",
      blocks: [
        { t: "p", text: "The 4.0L WJ was built with the 42RE. The 4.7 used the 45RFE. {{likely:LIKELY}} by engine. Confirm the door sticker or the pan before you buy a solenoid pack. A 45RFE part does not belong on a 42RE. This package is a stated 4.0." },
        { t: "ul", items: [
          "Chart: under-hood cartridge 5 is 30A transmission, and the chart's own words are 4.0 solenoid / 4.7 TCM. Mini 28 is 15A, 4.0 transmission solenoid. Relay R3 is listed as TCM. {{stated:CHART}} Lid wins. Do not apply a 4.7 controller story until the sticker says 4.7.",
          "ATF+4 is the usual Chrysler fluid for this transmission. {{likely:LIKELY}} The owner manual and the dipstick win. Do not use a random multi-vehicle ATF because it was on sale.",
          "The level check people use: engine running, hot, in Neutral, parking brake set, level ground. {{likely:LIKELY}} procedure. Read the marks on the stick. Do not overfill it to hide a flare.",
          "A flare or a late shift is not an IAC problem. Keep it off the idle chain. No rebuild part numbers here."
        ] },
        { t: "p", text: "Will not leave Park: the brake-switch fuse on the owner chart is interior 23. Brake lights dead plus a Park lock is that switch more often than the transmission. Cover wins." },
        { t: "links", items: [
          ["https://www.amazon.com/s?k=ATF+4+automatic+transmission+fluid", "Amazon search: ATF+4"]
        ] },
        { t: "go", id: "brakes", label: "Brake switch and Park" },
        { t: "go", id: "pdc", label: "Transmission fuses on the PDC chart" }
      ]
    },
    {
      id: "tcase",
      code: "4WD",
      group: "drive",
      title: "Transfer case and axles",
      blurb: "Read the shifter. Do not guess NP231 versus NP242.",
      kicker: "Drivetrain · four wheel drive",
      find: "transfer case np231 np242 command-trac selec-trac 4wd axle u-joint tow",
      blocks: [
        { t: "p", text: "This WJ is either an NP231 Command-Trac (part-time) or an NP242 Selec-Trac (the full-time option), depending on how it was built. {{test:TEST REQUIRED}} Read the shifter bezel. Do not order a chain, a pump, or a fluid by guessing the case." },
        { t: "ul", items: [
          "Command-Trac is not driven on dry pavement in 4 High. That binds the driveline. The full-time range, if the bezel has one, is the range that can. The bezel text wins over this sentence.",
          "Do not tow it with all four tires on the ground unless the owner manual for this transfer case says that is allowed. Most of these cases want the rear driveshaft removed or a flatbed. {{likely:LIKELY}} caution. Read the manual in the glovebox before the tow.",
          "The front axle is solid. U-joints, unit bearings, and the axle disconnect on some Command-Trac trucks are separate from death wobble. A clunk only when 4WD engages is often the linkage or the disconnect, not the transmission.",
          "No part numbers and no fluid spec on this page. The tag on the case and the owner manual win."
        ] },
        { t: "go", id: "wobble", label: "Death wobble" },
        { t: "go", id: "trans", label: "42RE, if the problem is in gear" }
      ]
    },
    {
      id: "ps",
      code: "PS",
      group: "drive",
      title: "Power steering",
      blurb: "Not a vacuum hose. Do not pull these lines to chase idle.",
      kicker: "Drivetrain · steering assist",
      find: "power steering pump groan hose fluid heavy wheel belt",
      blocks: [
        { t: "p", text: "A heavy wheel, a groan that changes with steering, or fluid on the frame is the pump, a hose, the fluid level, or the box. It is not the idle chain. The belt has to be on the pump pulley. A squeal at the belt is the belt page." },
        { t: "card", kind: "stop", title: "Do not pull these hoses for a vacuum test", text: "Power-steering hoses are not on the hose map. Fluid on the exhaust is its own fire risk. Degrease cold. If the manifold is glowing, stop and use Guide 05. Do not open a pressure hose to see." },
        { t: "p", text: "The reservoir cap and the owner manual name the fluid. Do not pour brake fluid in it. No pump part number here. Match by VIN if the pump is actually the failed part." },
        { t: "go", id: "belt", label: "Serpentine belt" },
        { t: "go", id: "wobble", label: "Death wobble, if the wheel shakes" },
        { t: "jump", act: "goto", mode: "bench", map: "hoses", label: "Hose map, vacuum only" }
      ]
    },
    {
      id: "wobble",
      code: "WBBL",
      group: "chassis",
      title: "Death wobble",
      blurb: "Solid axle. A pattern, not one part. Stabilizer hides it.",
      kicker: "Chassis · steering",
      find: "death wobble track bar drag link ball joint control arm stabilizer shake",
      blocks: [
        { t: "p", text: "A violent shake in the steering at highway speed, often after a bump, is the pattern called death wobble. It is a pattern, not a single part. {{likely:LIKELY}} that a loose track bar or a wallowed track-bar bracket is in the mix. Also on the list: drag-link ends, ball joints, control-arm bushings, tire balance, and a bent wheel." },
        { t: "ul", items: [
          "A steering stabilizer can hide the shake. It does not fix the play.",
          "Check with the tires on the ground, engine off, truck not hanging from a jack that unloads the axle. A helper moves the wheel a few inches. Watch the track bar at the axle and at the frame. Play you can see is the fault.",
          "No torque on this page. Do not tighten from memory. Use a WJ spec, not a 2005+ WK spec.",
          "Do not buy a full set of control arms because of one clunk until you have seen which joint moves."
        ] },
        { t: "go", id: "ps", label: "Power steering, if it is heavy instead of shaking" },
        { t: "go", id: "tcase", label: "Axles and the transfer case" }
      ]
    },
    {
      id: "brakes",
      code: "BRK",
      group: "chassis",
      title: "Brakes and the booster",
      blurb: "Hard pedal can be the idle leak. Soft pedal is fluid. Do not pinch the booster hose.",
      kicker: "Chassis · brakes",
      find: "brake booster hard pedal soft pedal brake switch park lights rotors abs",
      blocks: [
        { t: "p", text: "A hard pedal and a hiss at the booster hose can be the same leak that raises idle. That hose is on the hose map. Do not pinch it if that pedal is your only brake. Wheels chocked, Park, parking brake set." },
        { t: "card", kind: "stop", title: "A pedal that goes to the floor", text: "Fluid, air, or a leak at a wheel or the master. Not a vacuum leak. Do not drive it." },
        { t: "ul", items: [
          "A pulse during a hard stop can be ABS doing its job. A pulse on a gentle stop is often rotors. The ABS light is the next page.",
          "Owner chart: interior fuse 23 is the brake switch, 15A. Brake lights dead, and the 42RE will not leave Park, is that switch more often than the transmission. {{likely:LIKELY}} The cover wins.",
          "No pad or rotor part numbers here."
        ] },
        { t: "jump", act: "goto", mode: "bench", map: "hoses", node: "booster", label: "Booster on the hose map" },
        { t: "go", id: "abs", label: "ABS light" },
        { t: "go", id: "trans", label: "Will not leave Park" }
      ]
    },
    {
      id: "abs",
      code: "ABS",
      group: "chassis",
      title: "ABS light",
      blurb: "Scan it. One wheel code is not four sensors and a module.",
      kicker: "Chassis · antilock",
      find: "abs light wheel speed sensor tone ring module pump fuse",
      blocks: [
        { t: "p", text: "The light means the controller saw a fault. It does not mean replace the module. A generic OBD reader often cannot see ABS codes. Use a tool that talks to the ABS controller." },
        { t: "ul", items: [
          "Owner chart: interior 19 is 10A antilock. Service chart: under-hood cartridge 4 is 40A ABS and mini 25 is 20A ABS. {{stated:CHART}} Cover and lid win. Measure before parts.",
          "A code for one wheel is that sensor, that tone ring, or that wire. Rings collect rust and metal dust. Look at the harness where it flexes. Do not buy four sensors for one code.",
          "A pump that buzzes and never stops is a different fault from a sensor code.",
          "Disconnecting the battery does not fix it. The light comes back when the fault is still there."
        ] },
        { t: "go", id: "brakes", label: "Pedal feel" },
        { t: "go", id: "pdc", label: "ABS fuses on the PDC chart" },
        { t: "go", id: "junction", label: "Interior ABS fuse" }
      ]
    },
    {
      id: "windows",
      code: "WIN",
      group: "body",
      title: "Windows, locks, seats",
      blurb: "One dead window is not four motors. Cavity 12 is a conflict.",
      kicker: "Body · windows and seats",
      find: "power window door harness lock seat breaker adjustable pedals cavity 12",
      blocks: [
        { t: "ul", items: [
          "One window dead: the switch, then the harness in the door boot, then the motor. Listen for a click at the motor before you buy one. A broken wire in the boot is a {{likely:LIKELY}} WJ find.",
          "Every window dead: a shared feed or a ground, not four motors.",
          "Under-hood cavity 12 is a conflict. One chart says door modules. Another says power windows. {{no:NOT CONFIRMED}} as a single job. Read the lid. Do not install a 50A fuse in a cavity the lid labels as something else.",
          "Owner chart: C2 is the 20A seat breaker. A seat that moves and then stops may be tripping it. Do not replace a breaker with a bigger fuse. Interior 10 is 20A adjustable pedals."
        ] },
        { t: "go", id: "pdc", label: "Cavity 12 conflict on the PDC page" },
        { t: "go", id: "grounds", label: "Grounds" }
      ]
    },
    {
      id: "lights",
      code: "LAMP",
      group: "body",
      title: "Lamps",
      blurb: "One bulb is a bulb. Both beams out is the fuse, the relay, or the switch.",
      kicker: "Body · lights",
      find: "headlight headlamp high beam low beam park fog relay bulb trailer",
      blocks: [
        { t: "p", text: "The owner chart names the lamp fuses. The cover wins. One bulb out is the bulb or the socket. Both low beams out, or both high beams out, is the fuse, the relay, or the switch. Do not buy four bulbs for a dead fuse." },
        { t: "table", caption: "Lamp rows from the 2004 owner chart. Amp and color are on the driver-side page. Cover wins.",
          heads: ["Cavity", "Job"],
          rows: [
            ["3", "High beam, left"],
            ["16", "High beam, right"],
            ["14", "Low beam, left"],
            ["15", "Low beam, right"],
            ["6", "Park lights"],
            ["24", "Fog lamps"],
            ["7", "Interior lights"],
            ["8", "Overhead console, rear wiper, panel lights, flipper glass"],
            ["18", "Trailer tow, 30A. Color was not extracted."]
          ] },
        { t: "p", text: "Headlamp relays are named on the junction cover, and headlamp feeds also show up in the under-hood charts (cartridge 3). Match the cover you are holding. Do not use a WK diagram. A lamp that eats fuses has a short or the wrong bulb. Do not upsize the fuse." },
        { t: "go", id: "junction", label: "Full driver-side chart" },
        { t: "go", id: "horn", label: "Horn" }
      ]
    },
    {
      id: "horn",
      code: "HORN",
      group: "body",
      title: "Horn",
      blurb: "Fuse and relay first. Clock spring means stop before the airbag.",
      kicker: "Body · horn",
      find: "horn relay clock spring airbag steering wheel",
      blocks: [
        { t: "p", text: "Chart: under-hood mini 18 is 15A horn, relay R9. {{stated:CHART}} The lid wins. Swap the relay only with the same type." },
        { t: "card", kind: "stop", title: "Horn dead and the airbag light on", text: "That pair points at the clock spring in the wheel. Do not pull the steering wheel and do not unbolt the airbag as a test. That is a restraint-system job: a procedure, a battery wait, and the right tools. Stop at the fuse and the relay unless you are set up for that job." },
        { t: "p", text: "A horn that works when the relay is jumped, and not from the wheel, is the switch or the clock spring. It is not the horn itself. Jump the relay only as a test, key in a safe state, and do not short across the wrong terminals." },
        { t: "go", id: "pdc", label: "Horn fuse and relay on the PDC chart" },
        { t: "go", id: "lights", label: "Lamps" }
      ]
    },
    {
      id: "radio",
      code: "RAD",
      group: "body",
      title: "Radio, amp, outlets",
      blurb: "Two radio fuses plus the outlets. IOD pull wipes presets.",
      kicker: "Body · radio",
      find: "radio amplifier power outlet cigar lighter fuse presets antenna",
      blocks: [
        { t: "p", text: "Owner chart, cover wins: cavity 5 is 25A radio/amplifier, cavity 30 is 15A radio, cavity 9 is 20A power outlets, cavity 26 is 15A cigar lighter. An amplifier is optional. No display is often fuse 30, or the IOD fuse was pulled for storage and the radio lost its keep-alive. Presets die when IOD is pulled. That is expected, not a failed radio." },
        { t: "ul", items: [
          "Display on, no sound: amp fuse (cavity 5 if this truck has an amp), the amp, or the speakers. Do not buy a radio for a mute amp.",
          "A dead lighter socket is often fuse 26 or 9, or debris in the socket. Do not probe the socket with a screwdriver.",
          "An aftermarket radio wired to a constant feed is a classic overnight draw. See the IOD page before another battery.",
          "No radio part number here."
        ] },
        { t: "go", id: "junction", label: "Driver-side chart" },
        { t: "go", id: "iod", label: "IOD and presets" }
      ]
    },
    {
      id: "wipers",
      code: "WIP",
      group: "body",
      title: "Wipers and washers",
      blurb: "C1 is a breaker. It clicks and resets. Do not replace it with a fuse.",
      kicker: "Body · wipers",
      find: "wiper washer circuit breaker c1 motor linkage multifunction switch rear wiper",
      blocks: [
        { t: "p", text: "Owner chart: C1 is a 20A wiper circuit breaker, not a fuse that stays open. It can click and reset. A wiper that runs and then stops, or parks in the wrong place, may be tripping C1 because the linkage is dry or the motor is stalled. Do not replace C1 with a 30A fuse." },
        { t: "ul", items: [
          "Chart relays R4 (wiper on/off) and R5 (wiper high/low) are in the under-hood box. {{stated:CHART}} Lid wins.",
          "Washer motors and the rear wiper switch are interior 29, 10A, on the owner chart. Rear wiper feed is also on cavity 8 with the overhead console. A dead rear wiper is not automatically a front-motor job.",
          "After the breaker and the linkage check out, the column multifunction switch is a {{likely:LIKELY}} WJ failure. No part number here. Match the switch by VIN.",
          "Do not unbolt the airbag to reach a wiper switch. See the horn page if the wheel has to come off."
        ] },
        { t: "go", id: "junction", label: "Breaker C1 on the driver-side chart" },
        { t: "go", id: "pdc", label: "Wiper relays on the PDC chart" },
        { t: "go", id: "how", label: "Why a breaker is not a fuse" }
      ]
    }
  ]
};

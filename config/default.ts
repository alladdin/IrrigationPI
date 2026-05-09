export default {
  server: {
    port: 3000,
  },
  //relays: [530, 535, 536, 537, 520, 519, 529, 534],
  relays: {
    pump: {
      pin: 534,
      relay: 7,
    },
    valve6: {
      pin: 530,
      relay: 0,
    },
    valve5: {
      pin: 535,
      relay: 1,
    },
    valve4: {
      pin: 536,
      relay: 2,
    },
    valve3: {
      pin: 537,
      relay: 3,
    },
    valve2: {
      pin: 520,
      relay: 4,
    },
    valve1: {
      pin: 519,
      relay: 5,
    },
    valve0: {
      pin: 529,
      relay: 6,
    },
  }
};
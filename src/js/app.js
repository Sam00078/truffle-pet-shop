App = {
  network: 'http://location:7545',
  web3Provider: null,
  contracts: {},

  init: () => {
    // Load pets.
    App.initView();
    return App.initWeb3();
  },

  initView: () => $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      data.map((item, key) => {
        petTemplate.find('.panel-title').text(item.name);
        petTemplate.find('img').attr('src', item.picture);
        petTemplate.find('.pet-breed').text(item.breed);
        petTemplate.find('.pet-age').text(item.age);
        petTemplate.find('.pet-location').text(item.location);
        petTemplate.find('.btn-adopt').attr('data-id', item.id);
        petsRow.append(petTemplate.html());
      });
  }),

  initWeb3: () => {
    web3 = new Web3(
      App.web3Provider = typeof web3 !== 'undefined'
        ? web3.currentProvider
        : new Web3.providers.HttpProvider(App.network)
    );
    return App.initContract();
  },

  initContract: () => {
    $.getJSON('Adoption.json', function (data) {
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      App.contracts.Adoption.setProvider(App.web3Provider);
      App.listenEvents();
    });
    return App.bindEvents();
  },

  listenEvents: () => setInterval(() => App.markAdopted(), 1000),
  bindEvents: () => $(document).on('click', '.btn-adopt', App.handleAdopt),

  markAdopted: async () => {
    var instance = await App.contracts.Adoption.deployed();
    var adopters = await instance.getAdopters.call();

    adopters.map((adopter, i) => {
      if(adopter !== '0x' && adopter !== '0x0' && Number(adopter) !== 0) {
        $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
      }
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    web3.eth.getAccounts(async (error, accounts) => {
      if(error) console.log(error);
      var account = accounts[0];
      var instance = await App.contracts.Adoption.deployed();
      await instance.adopt(petId, { from: account });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

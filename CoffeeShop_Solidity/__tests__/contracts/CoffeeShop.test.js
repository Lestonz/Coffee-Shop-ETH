
const { expect } = require('chai');
const { ethers } = require("hardhat");

contract('CoffeeShop', ([deployer, author, tipper]) => {
  let coffeeShop 

  before(async () => {
    coffeeShop  = await CoffeeShop.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await coffeeShop.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await coffeeShop.name()
      assert.equal(name, 'CoffeeShop')
    })
  })

  describe('coffees', async () => {
    let result, coffeeCount
    const hash = 'abc123'

    before(async () => {
      result = await coffeeShop.orderCoffee(hash, 'Coffee description', { from: author })
      coffeesCount = await coffeeShop.coffeeCount()
    })

    //check event
    it('creates images', async () => {
      // SUCESS
      assert.equal(coffeeCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), coffeeCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.description, 'Coffee description', 'description is correct')
      assert.equal(event.priceAmount, '0', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')


      // FAILURE: Image must have hash
      await coffeeShop.orderCoffee('', 'Coffee description', { from: author }).should.be.rejected;

      // FAILURE: Image must have description
      await coffeeShop.orderCoffee('Coffee hash', '', { from: author }).should.be.rejected;
    })

    //check from Struct
    it('lists coffees', async () => {
      const coffee = await orderCoffee.coffees(coffeeCount)
      assert.equal(coffee.id.toNumber(), coffeeCount.toNumber(), 'id is correct')
      assert.equal(coffee.hash, hash, 'Hash is correct')
      assert.equal(coffee.description, 'Coffee description', 'description is correct')
      assert.equal(coffee.priceAmount, '0', 'price amount is correct')
      assert.equal(coffee.author, author, 'author is correct')
    })

    it('allows users to tip coffees', async () => {
      // Track the author balance before purchase
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

      result = await coffeeShop.priceCoffeeOwner(coffeeCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

      // SUCCESS
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), coffeeCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.description, 'Coffee description', 'description is correct')
      assert.equal(event.priceAmount, '1000000000000000000', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')

      // Check that author received funds
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let priceCoffeeOwner
      priceCoffeeOwner = web3.utils.toWei('1', 'Ether')
      priceCoffeeOwner = new web3.utils.BN(priceCoffeeOwner)

      const expectedBalance = oldAuthorBalance.add(priceCoffeeOwner)

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

      // FAILURE: Tries to tip a image that does not exist
      await coffeeShop.priceCoffeeOwner(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
    })
  })
})
    
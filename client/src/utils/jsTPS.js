export class jsTPS_Transaction {
  doTransaction() {}
  undoTransaction() {}
}

/*  Handles create/delete of list items */
export class UpdateRegion_Transaction extends jsTPS_Transaction {
  // opcodes: 0 - delete, 1 - add
  constructor(idPath, regionId, region, opcode, addfunc, delfunc, index = -1) {
    super()
    this.idPath = idPath
    this.regionId = regionId
    this.region = region
    this.addFunction = addfunc
    this.deleteFunction = delfunc
    this.opcode = opcode
    this.index = index
  }
  async doTransaction() {
    let data
    this.opcode === 0
      ? ({ data } = await this.deleteFunction({
          variables: {
            regionId: this.regionId,
            ids: this.idPath,
            index: this.index,
          },
        }))
      : ({ data } = await this.addFunction({
          variables: {
            region: this.region,
            ids: this.idPath,
            index: this.index,
          },
        }))

    if (this.opcode !== 0) {
      this.region._id = this.regionId = data.addSubRegion
    }
    return data
  }
  // Since delete/add are opposites, flip matching opcode
  async undoTransaction() {
    let data
    console.log(this.region)
    this.opcode === 1
      ? ({ data } = await this.deleteFunction({
          variables: {
            regionId: this.regionId,
            ids: this.idPath,
            index: this.index,
          },
        }))
      : ({ data } = await this.addFunction({
          variables: {
            region: this.region,
            ids: this.idPath,
            index: this.index,
          },
        }))

    if (this.opcode !== 1) {
      this.region._id = this.regionId = data.addSubRegion
    }
    return data
  }
}

export class EditRegionLandmark_Transaction extends jsTPS_Transaction {
  constructor(idPath, regionId, prev, update, callback) {
    super()
    this.idPath = idPath
    this.regionId = regionId
    this.prev = prev
    this.update = update
    this.updateFunction = callback
  }

  async doTransaction() {
    const { data } = await this.updateFunction({
      variables: {
        regionId: this.regionId,
        ids: this.idPath,
        value: this.update,
        prev: this.prev,
      },
    })
    return data
  }

  async undoTransaction() {
    const { data } = await this.updateFunction({
      variables: {
        regionId: this.regionId,
        ids: this.idPath,
        value: this.prev,
        prev: this.update,
      },
    })
    if (data) console.log(data)
    return data
  }
}

export class EditRegion_Transaction extends jsTPS_Transaction {
  constructor(idPath, regionId, field, prev, update, callback) {
    super()
    this.idPath = idPath
    this.regionId = regionId
    this.field = field
    this.prev = prev
    this.update = update
    this.updateFunction = callback
  }

  async doTransaction() {
    const { data } = await this.updateFunction({
      variables: {
        regionId: this.regionId,
        ids: this.idPath,
        field: this.field,
        value: this.update,
      },
    })
    return data
  }

  async undoTransaction() {
    const { data } = await this.updateFunction({
      variables: {
        regionId: this.regionId,
        ids: this.idPath,
        field: this.field,
        value: this.prev,
      },
    })
    if (data) console.log(data)
    return data
  }
}

export class SortRegions_Transaction extends jsTPS_Transaction {
  constructor(idPath, criteria, callback) {
    super()
    this.idPath = idPath
    this.criteria = criteria
    this.updateFunction = callback
  }
  async doTransaction() {
    const { data } = await this.updateFunction({
      variables: { ids: this.idPath, criteria: this.criteria },
    })
    if (data) {
      console.log(data)
      return data
    }
  }

  async undoTransaction() {
    const { data } = await this.updateFunction({
      variables: { ids: this.idPath, criteria: this.criteria },
    })
    if (data) {
      console.log(data)
      return data
    }
  }
}

// Handles create and delete of landmarks
export class UpdateLandmark_Transaction extends jsTPS_Transaction {
  // opcodes: 0 - delete, 1 - add
  constructor(idPath, opcode, regionId, landmark, addfunc, delfunc) {
    super()
    this.idPath = idPath
    this.landmark = landmark
    this.opcode = opcode
    this.regionId = regionId
    this.addFunction = addfunc
    this.deleteFunction = delfunc
  }
  async doTransaction() {
    let data
    this.opcode === 0
      ? ({ data } = await this.deleteFunction({
          variables: {
            regionId: this.regionId,
            ids: this.idPath,
            landmark: this.landmark,
          },
        }))
      : ({ data } = await this.addFunction({
          variables: {
            regionId: this.regionId,
            ids: this.idPath,
            landmark: this.landmark,
          },
        }))

    return data
  }
  // Since delete/add are opposites, flip matching opcode
  async undoTransaction() {
    let data
    this.opcode === 1
      ? ({ data } = await this.deleteFunction({
          variables: {
            regionId: this.regionId,
            ids: this.idPath,
            landmark: this.landmark,
          },
        }))
      : ({ data } = await this.addFunction({
          variables: {
            regionId: this.regionId,
            ids: this.idPath,
            landmark: this.landmark,
          },
        }))

    return data
  }
}

export class ChangeParent_Transaction extends jsTPS_Transaction {
  constructor(idPath, regionId, prevParentId, newParentId, callback) {
    super()
    this.idPath = idPath
    this.regionId = regionId
    this.prevParentId = prevParentId
    this.newParentId = newParentId
    this.changeParent = callback
  }
  async doTransaction() {
    const { data } = await this.changeParent({
      variables: {
        ids: this.idPath,
        regionId: this.regionId,
        prevParentId: this.prevParentId,
        newParentId: this.newParentId,
      },
    })
    if (data) {
      console.log(data)
      return data
    }
  }

  async undoTransaction() {
    const { data } = await this.changeParent({
      variables: {
        ids: this.idPath,
        regionId: this.regionId,
        prevParentId: this.newParentId,
        newParentId: this.prevParentId,
      },
    })
    if (data) {
      console.log(data)
      return data
    }
  }
}
export class jsTPS {
  constructor() {
    // THE TRANSACTION STACK
    this.transactions = []
    // KEEPS TRACK OF WHERE WE ARE IN THE STACK, THUS AFFECTING WHAT
    // TRANSACTION MAY BE DONE OR UNDONE AT ANY GIVEN TIME
    this.mostRecentTransaction = -1
    // THESE VARIABLES CAN BE TURNED ON AND OFF TO SIGNAL THAT
    // DO AND UNDO OPERATIONS ARE BEING PERFORMED
    this.performingDo = false
    this.performingUndo = false
  }

  /**
   * Tests to see if the do (i.e. redo) operation is currently being
   * performed. If it is, true is returned, if not, false.
   *
   * return true if the do (i.e. redo) operation is currently in the
   * process of executing, false otherwise.
   */
  isPerformingDo() {
    return this.performingDo
  }

  /**
   * Tests to see if the undo operation is currently being
   * performed. If it is, true is returned, if not, false.
   *
   * return true if the undo operation is currently in the
   * process of executing, false otherwise.
   */
  isPerformingUndo() {
    return this.performingUndo
  }

  /**
   * This function adds the transaction argument to the top of
   * the transaction processing system stack and then executes it. Note that it does
   * When this method has completed transaction will be at the top
   * of the stack, it will have been completed, and the counter have
   * been moved accordingly.
   *
   * param transaction The custom transaction to be added to
   * the transaction processing system stack and executed.
   */
  addTransaction(transaction) {
    // ARE THERE OLD UNDONE TRANSACTIONS ON THE STACK THAT FIRST
    // NEED TO BE CLEARED OUT, i.e. ARE WE BRANCHING?
    if (
      this.mostRecentTransaction < 0 ||
      this.mostRecentTransaction < this.transactions.length - 1
    ) {
      for (
        let i = this.transactions.length - 1;
        i > this.mostRecentTransaction;
        i--
      ) {
        this.transactions.splice(i, 1)
      }
    }

    // AND NOW ADD THE TRANSACTION
    this.transactions.push(transaction)
    // AND EXECUTE IT
    // this.doTransaction();
  }

  /**
   * This function executes the transaction at the location of the counter,
   * then moving the TPS counter. Note that this may be the transaction
   * at the top of the TPS stack or somewhere in the middle (i.e. a redo).
   */
  async doTransaction() {
    let retVal
    if (this.isPerformingDo() || this.isPerformingUndo()) return
    if (this.hasTransactionToRedo()) {
      this.performingDo = true
      let transaction = this.transactions[this.mostRecentTransaction + 1]
      retVal = await transaction.doTransaction()
      this.mostRecentTransaction++
      this.performingDo = false
    }
    console.log('transactions: ' + this.getSize())
    console.log('redo transactions:' + this.getRedoSize())
    console.log('undo transactions:' + this.getUndoSize())
    console.log(this.mostRecentTransaction)
    console.log(' ')
    return retVal
  }

  /**
   * This function checks to see if there is a transaction to undo. If there
   * is it will return it, if not, it will return null.
   *
   * return The transaction that would be executed if undo is performed, if
   * there is no transaction to undo, null is returned.
   */
  peekUndo() {
    if (this.hasTransactionToUndo()) {
      return this.transactions[this.mostRecentTransaction]
    } else return null
  }

  /**
   * This function checks to see if there is a transaction to redo. If there
   * is it will return it, if not, it will return null.
   *
   * return The transaction that would be executed if redo is performed, if
   * there is no transaction to undo, null is returned.
   */
  peekDo() {
    if (this.hasTransactionToRedo()) {
      return this.transactions[this.mostRecentTransaction + 1]
    } else return null
  }

  /**
   * This function gets the most recently executed transaction on the
   * TPS stack and undoes it, moving the TPS counter accordingly.
   */
  async undoTransaction() {
    let retVal
    if (this.isPerformingDo() || this.isPerformingUndo()) return
    if (this.hasTransactionToUndo()) {
      this.performingUndo = true
      let transaction = this.transactions[this.mostRecentTransaction]
      retVal = await transaction.undoTransaction()
      this.mostRecentTransaction--
      this.performingUndo = false
    }
    console.log('transactions: ' + this.getSize())
    console.log('redo transactions:' + this.getRedoSize())
    console.log('undo transactions:' + this.getUndoSize())
    console.log(this.mostRecentTransaction)
    console.log(' ')
    return retVal
  }

  /**
   * This method clears all transactions from the TPS stack
   * and resets the counter that keeps track of the location
   * of the top of the stack.
   */
  clearAllTransactions() {
    // REMOVE ALL THE TRANSACTIONS
    this.transactions = []

    // MAKE SURE TO RESET THE LOCATION OF THE
    // TOP OF THE TPS STACK TOO
    this.mostRecentTransaction = -1
  }

  /**
   * Accessor method that returns the number of transactions currently
   * on the transaction stack. This includes those that may have been
   * done, undone, and redone.
   *
   * return The number of transactions currently in the transaction stack.
   */
  getSize() {
    return this.transactions.length
  }

  /**
   * This method returns the number of transactions currently in the
   * transaction stack that can be redone, meaning they have been added
   * and done, and then undone.
   *
   * return The number of transactions in the stack that can be redone.
   */
  getRedoSize() {
    return this.getSize() - this.mostRecentTransaction - 1
  }

  /**
   * This method returns the number of transactions currently in the
   * transaction stack that can be undone.
   *
   * return The number of transactions in the transaction stack that
   * can be undone.
   */
  getUndoSize() {
    return this.mostRecentTransaction + 1
  }

  /**
   * This method tests to see if there is a transaction on the stack that
   * can be undone at the time this function is called.
   *
   * return true if an undo operation is possible, false otherwise.
   */
  hasTransactionToUndo() {
    return this.mostRecentTransaction >= 0
  }

  /**
   * This method tests to see if there is a transaction on the stack that
   * can be redone at the time this function is called.
   *
   * return true if a redo operation is possible, false otherwise.
   */
  hasTransactionToRedo() {
    return this.mostRecentTransaction < this.transactions.length - 1
  }

  /**
   * This method builds and returns a textual summary of the current
   * Transaction Processing System, this includes the toString of
   * each transaction in the stack.
   *
   * return A textual summary of the TPS.
   */
  // toString() {
  //     let text = "<br>" +"--Number of Transactions: " + this.transactions.length + "</br>";
  //     text += "<br>" + "--Current Index on Stack: " + this.mostRecentTransaction + "</br>";
  //     text += "<br>" + "--Current Transaction Stack:" + "</br>";
  //     for (let i = 0; i <= this.mostRecentTransaction; i++) {
  //         let jsT = this.transactions[i];
  //         text += "<br>" + "----" + jsT.toString() + "</br>";
  //     }
  //     return text;
  // }
}

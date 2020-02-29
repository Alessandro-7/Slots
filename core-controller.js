class CoreController {
  static spin() {
    const slotColNum = 5;
    const slotLineNum = 3;
    const uniqSym = 71; // unique id for get_symbol quest

    const spinResult = this.getSpinResult();

    console.table(`Result of the spin: ${spinResult.matrix.join(' ')}`);
    console.log(`${spinResult.spentMoney} was spent`);

    let isWin = false; // is the spin winning
    let isCombo = false; // does the spin has combo
    let isUniq = false; // does the spin has unique symbol

    let spinLen = spinResult.matrix.length;
    let countCombo = 0;

    // cheking the spin for winning, combo and unique symbol
    for (let i = 0; i < slotLineNum; ++i) {
      let currEl = spinResult.matrix[i];
      for (let j = 1; j <= slotColNum; ++j) {
        let currIndex = slotLineNum * j + i;
        if (spinResult.matrix[currIndex] == currEl) {
          ++countCombo;
          isWin = true;
          if (countCombo == 2)
            isCombo = true;
          if (countCombo > 2) // it isn't said that repetitions of more than 3 elements are also combo
            isCombo = false;
        } else
          countCombo = 0;
        if (currEl == uniqSym)
          isUniq = true;
        currEl = spinResult.matrix[currIndex];
      }
    }
    this.updateQuests(spinResult.spentMoney, isCombo, isUniq);
  }

  // updating quests based on the spin
  static updateQuests(_spentMoney, _isCombo, _isUniq) {
    let quests = this.getQuests();
    let updatedQuests = quests.map(function(quest, i, quests) {
      if (!quest.isCompleted) {
        switch (quest.questType) {
          case 'do_spin':
            ++quest.userQuestValue;
            break;
          case 'spent_money':
            quest.userQuestValue += _spentMoney;
            break;
          case 'combo_row':
            if (_isCombo)
              ++quest.userQuestValue;
            break;
          case 'get_symbol':
            if (_isUniq)
              ++quest.userQuestValue;
            break;
        }
        if (quest.userQuestValue >= quest.questValue) {
          quest.isCompleted = true;
          quest.dateCompleted = new Date();
          console.log(`User with userId = ${quest.userId} have completed the quest id = ${quest.id}`)
        }
      }
      return quest;
    });
  }

  static getQuests() {
    return [{
        id: 0, // I don't understand why ids were the same so I made them different
        userId: 1,
        questType: 'do_spin',
        questValue: 12,
        userQuestValue: 0,
        isCompleted: false,
        dateCompleted: null
      },
      {
        id: 1,
        userId: 1,
        questType: 'spent_money',
        questValue: 2000,
        userQuestValue: 0,
        isCompleted: false,
        dateCompleted: null
      },
      {
        id: 2,
        userId: 1,
        questType: 'combo_row',
        questValue: 1,
        userQuestValue: 0,
        isCompleted: false,
        dateCompleted: null
      },
      {
        id: 3,
        userId: 1,
        questType: 'get_symbol',
        questValue: 1,
        userQuestValue: 0,
        isCompleted: false,
        dateCompleted: null
      }
    ]
  }

  static getSpinResult() {
    return {
      matrix: [1, 3, 7, 2, 3, 5, 6, 3, 4, 7, 2, 71, 9, 9, 4],
      spentMoney: 1000,
    }
  }
}

module.exports = CoreController;

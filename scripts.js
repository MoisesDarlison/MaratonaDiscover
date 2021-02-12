const Modal = {
    open() {
        document.querySelector('.modal-overlay')
            .classList.add('active')
    },
    close() {
        document.querySelector('.modal-overlay')
            .classList.remove('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("devFinances:transaction")) || []
    },
    set(transactions) {
        localStorage.setItem("devFinances:transaction", JSON.stringify(transactions))
    },
}

const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction);
        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1);
        App.reload()
    },
    incomes() { //entradas
        let income = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        });
        return income
    },
    expenses() {//saidas
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        });
        return expense
    },
    total() {//total

        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionContainer: document.querySelector("#data-table tbody"),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const cSSClass = transaction.amount < 0 ? "expense" : "income";
        const numberStringFormated = Utils.valueFormatVirgula(transaction.amount)
        const html = `
            <td class="description">${transaction.description}</td>
            <td class=${cSSClass}>${numberStringFormated}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/menos.png" alt="remover Transação">
            </td>
            `
        return html
    },

    updateBalance() {
        document.getElementById("incomeDisplay").innerHTML = Utils.valueFormatVirgula(Transaction.incomes());
        document.getElementById("expenseDisplay").innerHTML = Utils.valueFormatVirgula(Transaction.expenses());
        document.getElementById("totalDisplay").innerHTML = Utils.valueFormatVirgula(Transaction.total());
    },

    clearTransactions() {
        DOM.transactionContainer.innerHTML = "";
    }
}

const Utils = {
    valueFormatAmount(value) {
        value = Number(value) * 100
        return value
    },

    valueFormatDate(date) {
        const SplittedDate = date.split("-");
        return `${SplittedDate[2]}/${SplittedDate[1]}/${SplittedDate[0]}`
    },

    valueFormatVirgula(value) {
        const signal = value > 0 ? "+" : ""
        value = (value / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    },
}

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    getvalues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validadeFields() {
        const { description, amount, date } = Form.getvalues();
        if (description.trim() === "" || amount.trim() === "" || date.trim === "") {
            throw new Error("Por Favor preencher todos os campos")
        }

    },

    formatFields() {
        let { description, amount, date } = Form.getvalues();
        amount = Utils.valueFormatAmount(amount);
        date = Utils.valueFormatDate(date);
        return {
            description,
            amount,
            date
        }
    },
    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },

    saveTransaction(transaction) {
        Transaction.add(transaction)
    },

    submit(event) {
        event.preventDefault();

        try {
            Form.validadeFields();
            const transaction = Form.formatFields();
            Form.saveTransaction(transaction)
            Form.clearFields()
            Modal.close()

        } catch (error) {
            alert(error.message)
        }

    }
}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        DOM.updateBalance();
        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions();
        App.init()
    }
}
App.init()

let budgetController = (function(){
    let Income = function(id,description,value){
        this.id = id;
        this.description = description,
        this.value = value
    }
    let Expense = function(id,description,value){
        this.id = id;
        this.description = description,
        this.value = value,
        this.percentage = -1
    }
    Expense.prototype.calculatePercentage = function(totalIncome){
        if(totalIncome > 0){
            this.percentage = (this.value/totalIncome)*100;
            this.percentage = this.percentage.toFixed(2);
        }else
            this.percentage = -1;
    }
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    let data = {
        allItems:{
            inc: [],
            exp: []
        },
        total:{
            inc:0,
            exp:0
        },
        budget: 0,
        percentage: -1
    }
    let calculateTotal = function(type){
        let sum = 0;
        data.allItems[type].forEach(function(curr){
            sum += curr.value;
        });
        data.total[type] = sum;
    }
    return{
        addItem:function(type,description,value){
            let ID = 0;
            if(data.allItems[type].length > 0)
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            let newItem;
            if(type === 'inc')
                newItem = new Income(ID,description,value);
            else
                newItem = new Expense(ID,description,value);
            data.allItems[type].push(newItem);
            return newItem;
        },
        getData: function(){
            console.log(data);
        },
        calculateBudget: function(){
            calculateTotal('inc');
            calculateTotal('exp');
            data.budget = data.total.inc - data.total.exp;
            if(data.total.inc > 0){
                data.percentage = (data.total.exp / data.total.inc)*100;
                data.percentage = data.percentage.toFixed(2)
            }else
                data.percentage = -1;
        },
        getBudget:function(){
            return {
                totalIncome : data.total.inc,
                totalExpense: data.total.exp,
                budgetValue: data.budget,
                percentage: data.percentage
            };
        },
        deleteItem:function(type,id){
            let ids;
            ids = data.allItems[type].map(function(curr){
                return curr.id;
            });
            let idIndex = ids.indexOf(ids,id);
            data.allItems[type].splice(idIndex,1);
            
        },
        calculatePercentages: function(){
            data.allItems.exp.forEach(function(exp){
                exp.calculatePercentage(data.total.inc);
            });
        },
        getPercentages: function(){
            let percentages = data.allItems.exp.map(function(exp){
                return exp.percentage;
            });
            console.log(percentages);
            return percentages;
        }
    }
})();

let UIController = (function(){
    let DOMString = {
        typeSelect: '.add__type',
        descriptionSelect: '.add__description',
        valueSelect: '.add__value',
        addbtnSelect: '.add__btn',
        incomeListSelect: '.income__list',
        expenseListSelect: '.expenses__list',
        budgetValueSelect: '.budget__value',
        incomeValueSelect: '.budget__income--value',
        expenseValueSelect: '.budget__expenses--value',
        expensePercentageSelect: '.budget__expenses--percentage',
        domContainer: '.container',
        percentageSelect: '.item__percentage',
        monthSelector: '.budget__title--month'
    };
    return{
        getDOMString:function(){
            return DOMString;
        },
        getInput: function(){
            return{
                type: document.querySelector(DOMString.typeSelect).value,
                description: document.querySelector(DOMString.descriptionSelect).value,
                value: parseFloat(document.querySelector(DOMString.valueSelect).value)
            }
        },
        addListItem:function(item,type){
             let html = '';
             if(type == 'inc'){
                 html +=  '<div class="item clearfix" id="inc-%id%">';
                 html += '<div class="item__description">%description%</div>';
                 html += '<div class="right clearfix">';
                 html += '<div class="item__value">+ %value%</div>';
                 html += '<div class="item__delete">';
                 html += '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>';
                 html += '</div>';
                 html += '</div>';
                 html += '</div>';
             }else{
                 html += '<div class="item clearfix" id="exp-%id%">';
                 html += '<div class="item__description">%description%</div>';
                 html += '<div class="right clearfix">';
                 html += '<div class="item__value">- %value%</div>';
                 html += '<div class="item__percentage">21%</div>';
                 html += '<div class="item__delete">';
                 html += '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>';
                 html +=  '</div>';
                 html += '</div>';
                 html += '</div>';
             }
             html = html.replace('%id%',item.id);
             html = html.replace('%description%',item.description);
             html = html.replace('%value%',item.value);
             if(type === 'inc'){
                 let el = document.querySelector(DOMString.incomeListSelect);
                 el.insertAdjacentHTML('beforeend',html);
             }else{
                 let el = document.querySelector(DOMString.expenseListSelect);
                 el.insertAdjacentHTML('beforeend',html);
             }
        },
        clearFields:function(){
            let fields = document.querySelectorAll(DOMString.descriptionSelect+', '+DOMString.valueSelect);
            let fieldArray = Array.prototype.slice.call(fields);
            fieldArray.forEach(function(curr){
                curr.value = '';
            });

        },
        displayBudget: function(budget){
             document.querySelector(DOMString.incomeValueSelect).textContent = budget.totalIncome;
             document.querySelector(DOMString.expenseValueSelect).textContent = budget.totalExpense;
             document.querySelector(DOMString.budgetValueSelect).textContent = budget.budgetValue;
             if(budget.percentage === -1)
                    document.querySelector(DOMString.expensePercentageSelect).textContent = '--';
             else
                document.querySelector(DOMString.expensePercentageSelect).textContent = budget.percentage + '%';
 
        },
        deleteItemUI: function(itemID){
            let element = document.getElementById(itemID);
            element.parentNode.removeChild(element);
        },
        displayPercentages: function(percentages){
            let elements = document.querySelectorAll(DOMString.percentageSelect);
            let nodeSelectAll = function(fields,callback){
                for(let i = 0; i < fields.length; i++){
                    callback(fields[i],percentages[i]);
                }
            }
            nodeSelectAll(elements,function(el,val){
                el.textContent = val + '%';
            });
        },
        displayMonths: function(){
            let today = new Date();
            let monthId = today.getMonth();
            let year = today.getFullYear();
            let months = ['January','February','March','April','May','June','July','August','September','October','November','Decemebr'];
            document.querySelector(DOMString.monthSelector).textContent = months[monthId] + ' ' + year;
        }

    }
})();

let Controller = (function(budgetCntrl,UIcntrl){
    let setupEventListener = function(){
        let DOMString = UIcntrl.getDOMString();
        document.querySelector(DOMString.addbtnSelect).addEventListener('click',cntrlAddItem);
        addEventListener('keypress',function(event){
            if(event.keyCode === 13){
                cntrlAddItem();
            }
        });
        document.querySelector(DOMString.domContainer).addEventListener('click',cntrlDeleteItem);
    }
    let cntrlDeleteItem = function(event){
        let itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            let items = itemID.split('-');
            let type = items[0];
            let id  = items[1];
            budgetCntrl.deleteItem(type,id);
            UIcntrl.deleteItemUI(itemID);
            updateBudget();
            updatePercentages();
        }
    }
    let updateBudget = function(){
        budgetCntrl.calculateBudget();
        let budget = budgetCntrl.getBudget();
        UIcntrl.displayBudget(budget);
    }
    let cntrlAddItem = function(){
        let input = UIcntrl.getInput();
        if(input.description != "" && !isNaN(input.value) && input.value > 0){
            let item = budgetCntrl.addItem(input.type,input.description,input.value);
            UIcntrl.addListItem(item,input.type);
            UIcntrl.clearFields();
            updateBudget();
            updatePercentages();
        }
    }
    let updatePercentages = function(){
        budgetCntrl.calculatePercentages();
        let percentages = budgetCntrl.getPercentages();
        UIcntrl.displayPercentages(percentages);
    }
   
    return {
        init: function(){
            setupEventListener();
            UIcntrl.displayBudget({
                totalIncome:0,
                totalExpense:0,
                budget: 0,
                percentage: 0
            });
            UIcntrl.displayMonths();
        }
    }
})(budgetController,UIController);
Controller.init();
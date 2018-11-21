/*model having Cat objects*/
let modelCat = {
    currentCat: null,
    adminMode: false,
    cats: [{
        name: 'Tommy',
        url: 'images/cat1.jpg',
        clickCount: 0
    },
    {
        name: 'Shaila',
        url: 'images/cat2.jpg',
        clickCount: 0
    },
    {
        name: 'Jerry',
        url: 'images/cat3.jpg',
        clickCount: 0
    },
    {
        name: 'Truffles',
        url: 'images/cat4.jpg',
        clickCount: 0
    },
    {
        name: 'Laila',
        url: 'images/cat5.jpg',
        clickCount: 0
    }]
}

/*controller communicating with other objects*/
let Controller = {
    /*to initialize view objects*/
    init: function () {
        modelCat.adminMode = false;
        modelCat.currentCat = null;
        catListView.init();
        catView.init();
        admin.init();
    },
    /*to remove the current cat from the display list*/
    removeCurrentCat: function () {
        catListView.render();
        modelCat.currentCat = null;
    },
    /*to display the cat on the event of option change*/
    displayCat: function (event) {
        catView.displayCat(event);
    },
    /*to display the current cat*/
    currentCatView: function (newCatObj) {
        modelCat.currentCat = catView.render(newCatObj);
        if (modelCat.adminMode === true) {
            this.adminRender();
        }
        this.incrementCount();
    },
    getCurrentCat: function () {
        return modelCat.currentCat
    },
    /*reads all cats present in model*/
    getCats: function () {
        return modelCat.cats;
    },
    /*increment count*/
    incrementCount: function () {
        catView.imgClick(modelCat.currentCat);
    },
    /*updates the adminMode flag*/
    update: function () {
        modelCat.adminMode = true;
    },
    cancel: function () {
        modelCat.adminMode = false;
    },
    /*to display the corresponding cat details inside the form*/
    adminRender: function () {
        admin.render();
    }

}



/*catListView object having list(select) of all cat names*/
let catListView = {
    init: function () {
        this.select = document.querySelector('select');
        this.main = document.querySelector('main');
        this.select.addEventListener('change', function (event) {
            Controller.displayCat(event);
        })
    },
    /*if default option is selected ,remove cat*/
    render: function () {
        let div = document.querySelector('.image');
        if (div !== null) {
            let item = this.main.lastElementChild;
            this.main.removeChild(item);
        }
    },
    /*to update the selected option name through admin mode inside drop down*/
    update : function(obj){
        this.select = document.querySelector('select');
        let selIndex = this.select.selectedIndex;
        let selElement = this.select.getElementsByTagName( 'option' )[ selIndex ];
        selElement.textContent=obj.name;
    }
};

/*Cat view object to display the cat and increment the counter*/
let catView = {
    /*reading Cat objects from the model*/
    init: function () {
        this.main = document.querySelector('main');
        this.cat = Controller.getCats();
    },
    /*incrementing count if cat image is clicked*/
    imgClick: function (currentCatImg) {
        document.querySelector('.cat').addEventListener('click', function () {
            for (let item of this.cat) {
                if (item.name === currentCatImg.name) {
                    item.clickCount++;
                    document.querySelector('.clickCount').textContent = item.clickCount;
                    Controller.adminRender();
                }
            }

        }.bind(this));
    },
    /*rending cat image on the page*/
    render: function (newCat) {
        Controller.removeCurrentCat();
        let div = document.createElement('div');
        div.classList.add('image');
        div.innerHTML += `<h3>${newCat.name}</h3>
                             <img class="cat" src="${newCat.url}" alt="cute cat">
                             <p>Click Count=<span class="clickCount">${newCat.clickCount}</span></p>`;
        this.main.appendChild(div);
        return newCat;
    },

    /*event handler function having steps to be followed when a cat is selected on the page*/
    displayCat: function (event) {

        if (this.cat.currentCat !== null && event.target.value === 'default') {
            Controller.removeCurrentCat();
        }
        else {
            for (let obj of this.cat) {
                if (this.cat.currentCat !== null && obj.name === event.target.value) {
                    Controller.currentCatView(obj);
                }
            }
        }
    }
};


/*admin mode object*/
let admin = {
    /*event handler function for admin button*/
    init: function () {
        document.querySelector('.admin').addEventListener('click', function () {
            document.querySelector('form').classList.remove('view');
            Controller.update();
            this.render();
            this.save();
            this.cancel();
        }.bind(this))
    },
    /*renders corresponding cat data inside the form*/
    render: function () {
        this.currentCat = Controller.getCurrentCat();
        if (this.currentCat !== null) {
            document.querySelector('.name').value = this.currentCat.name;
            document.querySelector('.url').value = this.currentCat.url;
            document.querySelector('.click').value = this.currentCat.clickCount;
        }
    },
    /*event handler for cancel button*/
    cancel: function () {
        document.querySelector('.cancel').addEventListener('click', function () {
            document.querySelector('form').classList.add('view');
            Controller.cancel();
        })
    },
    /*event handler for save button*/
    save: function () {
        this.currentCat = Controller.getCurrentCat();
        this.cats = Controller.getCats();
        document.querySelector('.save').addEventListener('click', function () {
            for (obj of this.cats) {
                if (this.currentCat.name === obj.name) {
                    obj.name = document.querySelector('.name').value;
                    obj.url = document.querySelector('.url').value;
                    obj.clickCount = document.querySelector('.click').value;
                    catListView.update(obj);
                    Controller.currentCatView(obj);
                    document.querySelector('form').classList.add('view');
                    Controller.cancel();
                }
            }
        }.bind(this))
    }
};
Controller.init();



// Create a variable to display if the list has not been assigned in HTML. Mostly for fun!
const defaultList = "This,list,has,not,been,assigned,!";

export class RandomList extends HTMLElement{
    constructor(){
        super();
        // Create a root for the shadow.
        let shadowRoot = this.attachShadow({mode: 'open'});
        // Get the title attribute, if not found - use default "All elements".
        this.title = this.getAttribute("title") || "All elements";
        // Append the html template as a child to the root.
        shadowRoot.appendChild(this._renderTemplate(this.title));

        // Get the string attribute (list) and convert to an array
        this.list = this.getAttribute("list") || defaultList;
        this.fullList = this.list.split(",");

        // Create an empty array
        this.pullList = [];

        // Get the ul from the shadowroot
        this.element = shadowRoot.querySelector("ul");

        // Get the buttons from the shadowroot as well
        this.pullButton = shadowRoot.querySelector("#pullButton");
        this.resetButton = shadowRoot.querySelector("#resetButton");

        // Get the html list elements from the shadowroot
        this.pullListHTML = shadowRoot.querySelector("#pullListHTML");
        this.fullListHTML = shadowRoot.querySelector("#fullListHTML");

        // For every element in the LIST ARRAY:
        for (let i=0; i < this.fullList.length; i++){
            // Add each list element to the ui.
            // First passes the ui as an argument,
            // Then passes the list array item.
            this.AddListElement(this.element,this.fullList[i]);
        }

        // Event listener for pull button
        this.pullButton.addEventListener("click", () => {
            // Run the pull function
            // Add the fullList & pullList arrays as arguments.
            // Add the list HTML items as arguments.

            // >>>>> The reason why I add these arguments everywhere in the eventlisteners, is because I could not figure a way around how to pass the list array & html element information without it.

            this.Pull(this.fullList,this.pullList,this.pullListHTML,this.fullListHTML);
        });


        // Event listener for reset button
        this.resetButton.addEventListener("click", () => {
            // Run the reset function.
            // Add the fullList & pullList arrays as arguments. (to clean the lists)
            // Add the list HTML items as arguments. (to fix the HTML items)
            this.pullList = [];
            this.UpdateList(this.pullList,this.pullListHTML,false);
            this.UpdateList(this.fullList,this.fullListHTML,true);
        });
    }

    _renderTemplate(title){
        // Create a HTML template function.
        const template = document.createElement('template');
        template.innerHTML = `
            <h1>${title}</h1>
            <ul id="fullListHTML"></ul>
            <button id="pullButton">Pull</button>
            <button id="resetButton">Reset</button>
            <h1>Pulled elements</h1>
            <ol id="pullListHTML"></ol>
        `;
        // Return the template content (cloned(?)).
        return template.content.cloneNode(true);
    }

    Pull(fullList,pullList,pullListHTML,fullListHTML){
        // Define variables to be used later
        let tryAgain = true;
        let toPull;

        // If the pullList is less than fullList (if there is more items to pull):
        if (pullList.length < fullList.length){
            while (tryAgain){
                // (Reset the tryAgain variable)
                tryAgain=false;

                // Get a random array item
                toPull = this.RandomNumberTo(fullList.length - 1);
                // Check all existing pulled items
                for (let i = 0; i < pullList.length; i++){
                    if (pullList[i] === fullList[toPull]){
                        // If this array item is already "pulled", try again to find a new one.
                        tryAgain=true;
                    }
                }
            }

            // Add the new element to the array.
            pullList.push(fullList[toPull]);  
            this.UpdateList(pullList,pullListHTML,false); 
            // Set the original list's children text to be pink colored, marking it as pulled.
            fullListHTML.children[toPull].style.color="pink";
        }
    }

    RandomNumberTo(num){
        // Generate a random number from 0 to 'num'.
        let mathNum = num + 1
        return Math.floor(Math.random() * mathNum);
    }
    
    AddListElement(list, string){
        // Create a li element.
        let temp = document.createElement("li");
        // Set the innerHTML.
        temp.innerHTML = string;
        // Append it as a child to a specified element.
        list.appendChild(temp);
    }
    
    UpdateList(list,listHTML,resetColor){
        // Reset the list

        // Remove all children from the HTML element
        while (listHTML.firstChild){
            listHTML.removeChild(listHTML.lastChild); 
        }

        // For all items in the array, create the li elements and add the array content.
        for(let i=0; i < list.length; i++){
            this.AddListElement(listHTML,list[i]);
        }

        // If resetcolor is active, reset the colors as well in the list.
        if (resetColor){
            // First, get the children of the HTML list.
            let children = listHTML.children;
            // For every child (li)
            for (let i=0; i < children.length; i++){
                // Set all text's style back to normal.
                children[i].style.color = "black";
            }         
        }
    }
    
}

customElements.define("random-list", RandomList);
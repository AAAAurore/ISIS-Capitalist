const fs = require('fs');

function saveWorld(context) {
    fs.writeFile("userworlds/" + context.user + "-world.json",
    JSON.stringify(context.world),
    err => {
        if (err) {
            console.error(err)
            throw new Error(
                `Erreur d'écriture du monde coté serveur.`
            )
        }
    })
}

function savePurchase(args, context) {
    let world = context.world;
    let id = args.id;
    let quantite = args.quantite;

    let product = world.products.find(p => p.id == id);
    
    if(product) {
        product.quantite += quantite;
        world.money -= product.cout;
        product.cout = product.cout * Math.pow(product.croissance, product.quantite - 1);

        let allUnlocks = world.allunlocks.filter(a => a.idcible == 0);
        let unlocksProduct = world.allunlocks.filter(a => a.idcible == product.id);

        allUnlocks.forEach(a => {
            let quantiteMin = 0;
            world.products.forEach(p => {
                if(p.quantite > quantiteMin){
                quantiteMin = p.quantite;
                }
            })

            if (quantiteMin >= a.seuil) {
                a.unlocked = true;
            }
        })

        unlocksProduct.forEach(u => {
            if (product.quantite >= u.seuil) {
                u.unlocked = true;
            }
        });

        saveWorld(context);
    }
    else{
        throw new Error(
            `Le produit avec l'identifiant ${id} n'existe pas.`
        )
    }
}

function saveProduction(args, context) {
    let world = context.world;
    let id = args.id;

    let product = world.products.find(p => p.id == id);
    
    if(product) {
        product.vitesse = product.timeleft;

        saveWorld(context);
    }
    else{
        throw new Error(
            `Le produit avec l'identifiant ${id} n'existe pas.`
        )
    }
}

function saveManager(args, context) {
    let world = context.world;
    let id = args.id;

    let manager = world.managers.find(m => m.id == id);

    if(manager) {
        let product = world.products.find(p => p == manager.idcible);

        if(product) {
            manager.unlocked = true;
            product.managerUnlocked = true;

            saveWorld(context);
        }
        else{
            throw new Error(
                `Le produit avec l'identifiant ${id} n'existe pas.`
            )
        }
    }
    else{
        throw new Error(
            `Le manager avec l'identifiant ${id} n'existe pas.`
        )
    }
}

function saveScore(context){
    let world = context.world;
    let products = world.products;

    if(products) {
        products.forEach(product => {
            let elapseTime = 0;
            let nbProduction = 0;
            let auto = product.unlocked && product.managerUnlocked;
    
            if (product.timeleft != 0 || auto) {
                elapseTime = Date.now() - Number(product.lastupdate);
                product.lastupdate = Date.now().toString();
                world.lastupdate = Date.now().toString();
    
                if (!product.managerUnlocked) {
                    if (elapseTime > product.timeleft) {          
                        nbProduction = 1;
                        product.timeleft = 0;
                    }
                    else {
                    nbProduction = 0;
                    product.timeleft -= elapseTime;
                    }
                }
                else {
                    if (elapseTime > product.timeleft) {
                        nbProduction = 1 + (elapseTime - product.timeleft) / product.vitesse;
                        product.timeleft  = product.vitesse - (elapseTime - product.timeleft) % product.vitesse;
                    }
                    else {
                        nbProduction = 0;
                        product.timeleft -= elapseTime;
                    }
                }
    
                for(var i = 0; i < nbProduction; i++) {
                    world.money += product.revenu * product.quantite;
                    world.score += product.revenu * product.quantite;
                }
                
                saveWorld(context);
            }
        });
    }
    else{
        throw new Error(
            `Il n'y a aucun produit.`
        )
    }
}

module.exports = {
    Query: {
        getWorld(parent, args, context) {
            saveScore(context);
            saveWorld(context);
            return context.world;
        }
    },
    Mutation: {
        acheterQtProduit(parent, args, context) {
            saveScore(context);
            savePurchase(args, context);
            return context.world;
        },
        lancerProductionProduit(parent, args, context) {
            saveScore(context);
            saveProduction(args, context);
            return context.world;
        },
        engagerManager(parent, args, context) {
            saveScore(context);
            saveManager(args, context);
            return context.world;
        },
    }
};
const fs = require('fs');

function saveWorld(context) {
    let world = context.world;
    let user = context.user;

    world.lastupdate = Date.now().toString();

    fs.writeFile("userworlds/" + user + "-world.json",
    JSON.stringify(world),
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

    let allUnlocks = world.allunlocks.filter(a => a.idcible == 0);

    allUnlocks.forEach(a => {
        let quantiteMin = 0;
        world.products.forEach((p, index) => {
            if(index == 0 || p.quantite < quantiteMin) {
                quantiteMin = p.quantite;
            }
        })

        if (quantiteMin >= a.seuil) {
            a.unlocked = true;
            world.products.forEach(p => {
                if (a.typeratio == "VITESSE") {
                    p.vitesse = p.vitesse / a.ratio;
                }
                else if (a.typeratio == "GAIN") {
                    p.revenu = p.revenu * a.ratio;
                }
                else{
                  world.angelbonus += a.ratio;
                }
            })
        }
    })

    let product = world.products.find(p => p.id == id);
    
    if(product) {
        product.quantite += quantite;
        world.money -= product.cout;
        product.cout = product.cout * Math.pow(product.croissance, product.quantite - 1);

        let unlocksProduct = world.allunlocks.filter(a => a.idcible == product.id);

        unlocksProduct.forEach(u => {
            if (product.quantite >= u.seuil) {
                u.unlocked = true;
                if (u.typeratio == "VITESSE") {
                    product.vitesse = product.vitesse / u.ratio;
                }
                else if (u.typeratio == "GAIN") {
                    product.revenu = product.revenu * u.ratio;
                }
                else{
                  world.angelbonus += u.ratio;
                }
            }
        });
    }
    else {
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
        product.timeleft = product.vitesse;
        product.lastupdate = Date.now().toString();
    }
    else {
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
        }
        else {
            throw new Error(
                `Le produit avec l'identifiant ${id} n'existe pas.`
            )
        }
    }
    else {
        throw new Error(
            `Le manager avec l'identifiant ${id} n'existe pas.`
        )
    }
}


function saveUpgrade(args, context) {
    let world = context.world;
    let name = args.name;

    let upgrade = world.upgrades.find(u => u.name == name);

    if(upgrade) {
        upgrade.unlocked = true;

        if(upgrade.idcible == 0) {
            world.products.forEach(p => {
                if (upgrade.typeratio == "VITESSE") {
                    world.money -= upgrade.seuil;
                    p.vitesse = p.vitesse / upgrade.ratio;
                }
                else if (upgrade.typeratio == "GAIN") {
                    world.money -= upgrade.seuil;
                    p.revenu = p.revenu * upgrade.ratio;
                }
                else{
                    world.activeangels -= upgrade.seuil;
                    world.angelbonus += upgrade.ratio;
                }
            })
        }
        else {
            let product = world.products.find(p => p == upgrade.idcible);

            if(product) {
                if (upgrade.typeratio == "VITESSE") {
                    product.vitesse = product.vitesse / upgrade.ratio;
                }
                else if (upgrade.typeratio == "GAIN") {
                    product.revenu = product.revenu * upgrade.ratio;
                }
                else{
                  world.angelbonus += upgrade.ratio;
                }
            }
            else{
                throw new Error(
                    `Le produit avec l'identifiant ${id} n'existe pas.`
                )
            }
        }
    }
    else {
        throw new Error(
            `Upgrade ${id} n'existe pas.`
        )
    }
}

function saveScore(context) {
    let world = context.world;
    let products = world.products;

    if(products) {
        products.forEach(product => {
            let elapseTime = 0;
            let nbProduction = 0;
            let auto = product.managerUnlocked;
    
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
                    world.money += product.revenu * product.quantite
                    * (1 + world.activeangels * world.angelbonus / 100);
                    world.score += product.revenu * product.quantite
                    * (1 + world.activeangels * world.angelbonus / 100);
                }
            }
        });
    }
    else {
        throw new Error(
            `Il n'y a aucun produit.`
        )
    }
}

function readWorld(context) {
    let world = context.world;
    let activeangels = 150 * Math.sqrt(this.world.score / Math.pow(10, 15));
    let totalangels = world.activeangels;

    let newWorld = require("./world");

    newWorld.activeangels = activeangels;
    newWorld.totalangels = totalangels;
    context.world = newWorld;
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
            saveWorld(context);
            return context.world;
        },
        lancerProductionProduit(parent, args, context) {
            saveScore(context);
            saveProduction(args, context);
            saveWorld(context);
            return context.world;
        },
        engagerManager(parent, args, context) {
            saveScore(context);
            saveManager(args, context);
            saveWorld(context);
            return context.world;
        },
        acheterCashUpgrade(parent, args, context) {
            saveScore(context);
            saveUpgrade(args, context);
            saveWorld(context);
            return context.world;
        },
        acheterAngelUpgrade(parent, args, context) {
            saveScore(context);
            saveUpgrade(args, context);
            saveWorld(context);
            return context.world;
        },
        resetWorld(context) {
            readWorld(context);
            saveWorld(context);
            return context.world;
        }
    }
};
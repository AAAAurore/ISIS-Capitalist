import {gql} from "@urql/core";

const GET_WORLD = gql`
  query GetWorld {
    getWorld {
      name
      logo
      money
      score
      totalangels
      activeangels
      angelbonus
      lastupdate
      products {
        id
        name
        logo
        cout
        croissance
        revenu
        vitesse
        quantite
        timeleft
        lastupdate
        unlocked
        managerUnlocked
        paliers {
          name
          logo
          seuil
          idcible
          ratio
          typeratio
          unlocked
        }
      }
      allunlocks {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      upgrades {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      angelupgrades {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
      managers {
        name
        logo
        seuil
        idcible
        ratio
        typeratio
        unlocked
      }
    }
  }
`;

const ACHETER_QT_PRODUIT = gql`
  mutation acheterQtProduit($id: Int!, $quantite: Int!) {
    acheterQtProduit(id: $id, quantite: $quantite) {
      id
      quantite
    }
  }
`;

const LANCER_PRODUCTION = gql`
  mutation lancerProductionProduit($id: Int!) {
    lancerProductionProduit(id: $id) {
      id
    }
  }
`;

const ENGAGER_MANAGER = gql`
  mutation engagerManager($name: String!) {
    engagerManager(name: $name) {
      name
    }
  }
`;

const ACHETER_CASHUPGRADE = gql`
  mutation acheterCashUpgrade($name: String!) {
    acheterCashUpgrade(name: $name) {
      name
    }
  }
`;

export default GET_WORLD;
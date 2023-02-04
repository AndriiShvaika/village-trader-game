import { useState, useEffect } from "react";
import {
  defaultDeposits,
  defaultStoragesData,
  defaultCityStoragesData,
  settings,
  gameStatuses,
} from "../config";

type transportOrdersType = {
  id: number;
  fromCityId: number;
  targetCityId: number;
  goodId: number;
  qty: number;
  days: number;
};

export const useAppLogic = () => {
  const [currentCity, setCurrentCity] = useState(1);

  const [selectedGood, setSelectedGood] = useState<null | number>(1);

  const [deposits, setDeposits] = useState(defaultDeposits);

  const [playerStorages, setPlayerStorages] = useState(defaultStoragesData);

  const [cityStorages, setCityStorages] = useState(defaultCityStoragesData);

  const [money, setMoney] = useState(settings.startMoney);
  const [days, setDays] = useState(1);

  const [transportOrders, setTransportOrders] = useState<transportOrdersType[]>(
    []
  );
  const [orderId, setOrderId] = useState(1);

  const [gameStatus, setGameStatus] = useState(gameStatuses.new);

  function getCurrentStorage<
    T extends { cityId: number; storage: T["storage"] }
  >(storages: T[]): T["storage"] {
    const store = storages.find((storage) => storage.cityId === currentCity);

    return store?.storage ?? [];
  }

  function sellGoods(goodId: number, qty: number, totalPrice: number) {
    const storagesNew = [...playerStorages];
    let moneyNew = money;

    const index = storagesNew.findIndex((storage) => {
      return storage.cityId === currentCity;
    });

    if (index > -1) {
      const goodIndex = storagesNew[index].storage.findIndex((good) => {
        return good.id === goodId;
      });

      if (goodIndex > -1) {
        const currentCityStorage = getCurrentStorage(cityStorages);

        const cityGoodIndex = currentCityStorage.findIndex((good) => {
          return good.id === goodId;
        });

        if (cityGoodIndex > -1) {
          if (storagesNew[index].storage[goodIndex].qty >= qty) {
            storagesNew[index].storage[goodIndex].qty -= qty;
            moneyNew += totalPrice;

            if (storagesNew[index].storage[goodIndex].qty === 0) {
              removeProduct(storagesNew[index].storage[goodIndex].id);
            }

            setMoney(moneyNew);
          }
        }
      }
    }

    setPlayerStorages(storagesNew);
  }

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function updateCityStorages() {
    const newCityStorages = cityStorages;

    for (let cityIndex = 0; cityIndex < newCityStorages.length; cityIndex++) {
      const storage = newCityStorages[cityIndex].storage;

      for (let goodIndex = 0; goodIndex < storage.length; goodIndex++) {
        const goodData = storage[goodIndex]; // id, priceData, maxStep, min, max price
        const priceChangeSign = getRandomInt(2) ? 1 : -1;
        const priceChangeValue =
          getRandomInt(goodData.maxStep + 1) * priceChangeSign;

        let newPrice = goodData.priceStats.slice(-1).pop()! + priceChangeValue;

        if (newPrice > goodData.maxPrice) {
          newPrice = goodData.maxPrice;
        }

        if (newPrice < goodData.minPrice) {
          newPrice = goodData.minPrice;
        }

        for (let i = 0; i < goodData.priceStats.length; i++) {
          goodData.priceStats[i] = goodData.priceStats[i + 1];
        }

        goodData.priceStats[goodData.priceStats.length - 1] = newPrice;

        // @ts-ignore
        newCityStorages[cityIndex][goodIndex] = goodData;
      }
    }

    setCityStorages(newCityStorages);
  }

  function updateTransportOrders() {
    setTransportOrders((oldTransportOrders) => {
      const newOrders = [...oldTransportOrders];

      newOrders.forEach((order) => {
        if (order.days >= 1) {
          order.days -= 1;
        }
      });

      return newOrders;
    });
  }

  function updateDeposits() {
    setDeposits((oldDeposits) => {
      const newDeposits = [...oldDeposits];

      newDeposits.forEach((deposit, index) => {
        if (deposit.days >= 1) {
          deposit.days -= 1;
        }

        if (deposit.days === 0) {
          newDeposits.splice(index, 1);

          setMoney((oldMoney) => {
            return oldMoney + deposit.amount * 1.1;
          });
        }
      });

      return newDeposits;
    });
  }

  function liveProcess() {
    setTimeout(() => {
      updateCityStorages();
      updateTransportOrders();
      updateDeposits();
      checkGameStatus(days + 1);

      setDays((days) => days + 1);
    }, 5000);
  }

  function checkGameStatus(days: number) {
    if (days >= settings.goalDays && money < settings.goalMoney) {
      setGameStatus(gameStatuses.fail);
    }

    if (money >= settings.goalMoney) {
      setGameStatus(gameStatuses.win);
    }
  }

  useEffect(() => {
    if (gameStatus === gameStatuses.new) {
      liveProcess();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  function createTransportOrder(targetCityId: number) {
    const newOrders = [...transportOrders];

    const storage = getCurrentStorage(playerStorages);

    const goodIndex = storage.findIndex((good) => good.id === selectedGood);

    if (goodIndex > -1) {
      newOrders.push({
        id: orderId,
        fromCityId: currentCity,
        targetCityId,
        goodId: selectedGood!,
        qty: storage[goodIndex].qty,
        days: 1,
      });

      setOrderId(orderId + 1);
      removeProduct(selectedGood!);
      setTransportOrders(newOrders);
    }
  }

  function removeProduct(productId: number) {
    const storagesNew = playerStorages;

    const index = storagesNew.findIndex((storage) => {
      return storage.cityId === currentCity;
    });

    if (index > -1) {
      const productIndex = storagesNew[index].storage.findIndex((product) => {
        return product.id === productId;
      });

      if (productIndex > -1) {
        storagesNew[index].storage.splice(productIndex, 1);
      }
    }

    setPlayerStorages(storagesNew);
  }

  function buyGoods(goodId: number, qty: number, price: number) {
    const totalPrice = qty * price;

    if (money >= totalPrice) {
      const storagesNew = playerStorages;

      const index = storagesNew.findIndex(
        (storage) => storage.cityId === currentCity
      );

      if (index > -1) {
        const goodIndex = storagesNew[index].storage.findIndex(
          (good) => good.id === goodId
        );

        if (goodIndex > -1) {
          storagesNew[index].storage[goodIndex].qty += qty;
        } else {
          storagesNew[index].storage.push({ id: goodId, qty: qty });
        }
      }

      setPlayerStorages(storagesNew);
      setMoney(money - totalPrice);
    }
  }

  function acceptOrder(order: {
    id: number;
    fromCityId: number;
    targetCityId: number;
    goodId: number;
    qty: number;
    days: number;
  }) {
    setTransportOrders((orders) => {
      const newOrders = [...orders];

      const index = newOrders.findIndex((o) => {
        return o.id === order.id;
      });

      if (index > -1) {
        newOrders.splice(index, 1);
      }

      return newOrders;
    });

    // update product qty in target city
    const storagesNew = playerStorages;

    const index = storagesNew.findIndex(
      (storage) => storage.cityId === order.targetCityId
    );

    if (index > -1) {
      const goodIndex = storagesNew[index].storage.findIndex(
        (good) => good.id === order.goodId
      );

      if (goodIndex > -1) {
        storagesNew[index].storage[goodIndex].qty += order.qty;
      } else {
        storagesNew[index].storage.push({ id: order.goodId, qty: order.qty });
      }
    }

    setPlayerStorages(storagesNew);
  }

  function getSelectedProductPrice() {
    const cityStorage = getCurrentStorage(cityStorages);

    const product = cityStorage.find((product) => product.id === selectedGood);

    if (product && product.priceStats) {
      return product.priceStats[product.priceStats.length - 1];
    }

    return 0;
  }

  function openDeposit(amount: number) {
    if (amount > 0 && money >= amount) {
      setDeposits((oldDeposits) => {
        const newDeposits = [...oldDeposits];

        newDeposits.push({
          days: 30,
          amount,
          id: getRandomInt(1000),
        });

        setMoney((oldMoney) => {
          return oldMoney - amount;
        });

        return newDeposits;
      });
    }
  }

  return {
    currentCity,
    setCurrentCity,
    getCurrentStorage,
    playerStorages,
    selectedGood,
    getSelectedProductPrice,
    setSelectedGood,
    sellGoods,
    createTransportOrder,
    transportOrders,
    acceptOrder,
    days,
    money,
    deposits,
    cityStorages,
    buyGoods,
    openDeposit,
    gameStatus,
  };
};

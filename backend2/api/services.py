
# according to the spec:
#In the pricing period for the given tariff simply average out all periods (if more than 1) and use this as the cent/kWh.
def tariffPriceEasyMethod(energyratestructure):
    total = 0
    total_tiers = 0
    for period in energyratestructure:
        for tier in period:
            total += tier['rate']
            total_tiers += 1
    
    average = total / total_tiers

    #to convert in cent/kWh
    in_cent = average * 100
    return round(in_cent, 2)


def calculateCostForTheFirstYear(energyratestructure):
    return round((tariffPriceEasyMethod(energyratestructure) / 100) * 24 * 365, 2)


def graphData(escalator, energyratestructure):
    data = [round(calculateCostForTheFirstYear(energyratestructure), 2)]
    for i in range(1, 20):
        value = data[i-1] + data[i-1]*(escalator/100)
        data.append(round(value, 2))
    return data


# hard method implementation

#approximatively according the graphic
load_curves = {
    "0": .3,
    "1": .28,
    "2": .23,
    "3": .2,
    "4": .2,
    "5": .2,
    "6": .2,
    "7": .28,
    "8": .3,
    "9": .4,
    "10": .43,
    "11": .48,
    "12": .5,
    "13": .5,
    "14": .52,
    "15": .6,
    "16": .6,
    "17": .5,
    "18": .42,
    "19": .6,
    "20": .8,
    "21": 1,
    "22": .8,
    "23": .6
}
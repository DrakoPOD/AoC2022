# %%
import json

# %%
raw = None

with open('./day13/example-13.txt') as file:
    raw = file.read()

raw

# %%
data = [[json.loads(y) for y in x.split('\n')] for x in raw.split('\n\n')]
data

# %%


def as_list(x):
    if type(x) is list:
        return x
    else:
        return [x]

# %%


def compare(arr1, arr2):
    i = 0
    while True:
        if len(arr1) == i:
            return True
        if len(arr2) == i:
            return True

        if type(arr1[i]) is int and type(arr2[i]) is int:
            if arr1[i] > arr2[i]:
                return False
        else:
            result = compare(as_list(arr1[i]), as_list(arr2[i]))

            if not result:
                return False
        i += 1


# %%
points = 0

for idx, arr in enumerate(data):
    result = compare(*arr)
    if (result):
        points += 1

points

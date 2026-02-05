import random
def delay():
    l=["Rock","Paper","Scissors"]
    for i in range(3):
        print(l[i], flush=True)
        import time
        time.sleep(0.5)
    for i in range(3):
        print(".", end="", flush=True)
        import time
        time.sleep(0.5)
    print()

comp=random.randint(1,3)
user=input("\nEnter r for Rock, p for Paper, s for Scissors: ")

compDict={1:"Rock",2:"Paper",3:"Scissors"}
userDict={"r":"Rock","p":"Paper","s":"Scissors"}


print("Computer is choosing\n", end="")
delay()

print(f"\nComputer chose {compDict[comp]} and You chose {userDict[user]}")

if compDict[comp] == userDict[user]:
    print("Draw")
elif (compDict[comp]=="Rock" and userDict[user]=="Scissors") or (compDict[comp]=="Paper" and userDict[user]=="Rock") or (compDict[comp]=="Scissors" and userDict[user]=="Paper"):
    print("You Lose, Computer Wins")
elif (compDict[comp]=="Rock" and userDict[user]=="Paper") or (compDict[comp]=="Paper" and userDict[user]=="Scissors") or (compDict[comp]=="Scissors" and userDict[user]=="Rock"):
    print("You Win, Computer Lost")
else:
    print("Invalid Input")#
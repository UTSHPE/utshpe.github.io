import random

def print_board(board): #prints the format of the 3x3 board
    for row in board:
        print(" | ".join(row))
        print("-" * 9)

def check_winner(board):#after each move, this function will check if there is a winner for either the player or bot
    for i in range(3):
        if board[i][0] == board[i][1] == board[i][2] != ' ':
            return board[i][0]
        if board[0][i] == board[1][i] == board[2][i] != ' ':
            return board[0][i]

    if board[0][0] == board[1][1] == board[2][2] != ' ':
        return board[0][0]
    if board[0][2] == board[1][1] == board[2][0] != ' ':
        return board[0][2]

    return None

def is_board_full(board): #checks each cell on your 3x3 board to see if there is a tie
    return all(all(cell != ' ' for cell in row) for row in board) 

def get_player_move(player, board):#this is a continuously running function that gets the input from the user to add their symbol to the board
    #TODO: Some code here
    while True:
        print("While the user thinks about their move, how can we make this game go smoothly?")

def get_bot_move(board): #use (random), a function that will allow us to generate a random spot on the board if there is space
    #TODO:Some code here
    print("Code something here!")

def tic_tac_toe():
    #TODO:your code goes here
    print("Hello World!")

if __name__ == "__main__":
    tic_tac_toe() #Calls your game! :D

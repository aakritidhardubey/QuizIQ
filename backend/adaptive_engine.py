def update_difficulty(current_level:str,correct:bool):
    levels=["easy","medium","hard"]
    i=levels.index(current_level)

    if correct and i<2:
        return levels[i+1]
    elif not correct and i>0:
        return levels[i-1]
    return current_level
import java.util.*;

public class HighLowCardGame {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();
        
        int score = 0;
        boolean playAgain = true;
        
        while (playAgain) {
            List<Integer> deck = initializeDeck();
            Collections.shuffle(deck, random);
            int currentCard = deck.get(0);
            
            System.out.println("Welcome to the High-Low Card Game!");
            System.out.println("Current Card: " + currentCard);
            
            System.out.print("Will the next card be (H)igh or (L)ow? Enter 'H' or 'L': ");
            String userGuess = scanner.next().toUpperCase();
            
            int nextCard = deck.get(1);
            System.out.println("Next Card: " + nextCard);
            
            if ((userGuess.equals("H") && nextCard > currentCard) || 
                (userGuess.equals("L") && nextCard < currentCard)) {
                System.out.println("Correct! You guessed right.");
                score++;
            } else {
                System.out.println("Incorrect. Game Over. Your score: " + score);
                score = 0;
            }
            
            System.out.print("Do you want to play again? (Y/N): ");
            String playAgainInput = scanner.next().toUpperCase();
            playAgain = playAgainInput.equals("Y");
        }
        
        System.out.println("Thank you for playing!");
        scanner.close();
    }
    
    public static List<Integer> initializeDeck() {
        List<Integer> deck = new ArrayList<>();
        for (int i = 2; i <= 14; i++) { // 2 to Ace (14)
            deck.add(i);
        }
        return deck;
    }
}

public class Sample {
    public static void main(String[] args) {
        Sample sample = new Sample();
        sample.printMessage("Hello World");
        int result = sample.calculateSum(5, 10);
        System.out.println("Sum is: " + result);
    }

    public void printMessage(String message) {
        System.out.println(message);
    }

    public int calculateSum(int a, int b) {
        return a + b;
    }
} 
import ComposeApp
import SwiftUI
import UIKit

struct ComposeView: UIViewControllerRepresentable {
    func makeUIViewController(context _: Context) -> UIViewController {
        MainViewControllerKt.MainViewController()
    }

    func updateUIViewController(_: UIViewController, context _: Context) {}
}

let v = SharedStorage_appleKt.SharedStorage(context: PlatformContext.Instance.shared, databaseName: "test-1")
struct ContentView: View {
    @State var value: String? = nil

    func setRandomValue() {
        Task {
            let rand = Int.random(in: 0 ... 1000)
            try await v.setValues(entries: [Entry(key: "1", value: String(rand))])
            readValue()
        }
    }

    func readValue() {
        Task {
            value = try await v.getValues(keys: ["1"]).first?.value
        }
    }
    
    func deleteValue() {
        Task {
            try await v.removeValues(keys: ["1"])
            readValue()
        }
    }

    var body: some View {
        VStack {
            Text("This is the storage: \(value ?? "-")")
            Button(action: setRandomValue, label: { Text("set random value") })
            Button(action: readValue, label: { Text("read value") })
            Button(action: deleteValue, label: { Text("delete value") })
        }.onAppear(perform: readValue)
    }
}

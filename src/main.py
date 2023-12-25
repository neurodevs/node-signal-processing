import numpy as np
import pandas as pd
from datetime import datetime
from scipy.signal import hilbert, firwin, lfilter, filtfilt

from matplotlib import pyplot as plt


def normalize_array(data):
    max_val = max(data)
    min_val = min(data)
    return [(value - min_val) / (max_val - min_val) for value in data]


def main():

    print(hilbert([1, 2, 3, 4])[2])
    
    # Function to create a FIR bandpass filter
    def fir_bandpass(lowcut, highcut, fs, numtaps):
        nyq = 0.5 * fs
        low = lowcut / nyq
        high = highcut / nyq
        taps = firwin(numtaps, [low, high], pass_zero=False)
        return taps

    num_samples = 1024  # 1024 or -1

    # Sampling rate and filter parameters
    fs = 64.0  # Sample rate, Hz (adjust as necessary)
    lowcut = 0.4
    highcut = 4.0
    numtaps = int(4 * fs)  # Number of filter taps (choose to suit the application)

    # Numtaps should be odd
    if numtaps % 2 == 0:
        numtaps += 1

    upper_color = 'forestgreen'
    lower_color = 'goldenrod'
    peak_color = 'salmon'

    # Read the CSV file
    df = pd.read_csv('/Users/ericyates/Downloads/muse-ppg.csv')[:num_samples]
    data = normalize_array(df['Infrared'])
    timestamps = df['time by space']

    # Create a FIR filter and apply it
    taps = fir_bandpass(lowcut, highcut, fs, numtaps)
    filtered_data = filtfilt(taps, 1.0, data)

    analytic_signal = hilbert(filtered_data)

    upper_envelope = np.abs(analytic_signal)

    upp = filtfilt(taps, 1.0, upper_envelope)
    lower_envelope = np.abs(hilbert(upp))

    print(taps.shape)

    peaks = np.where(filtered_data > lower_envelope, filtered_data, 0)
    display_peaks = np.where(filtered_data > lower_envelope, filtered_data, None)

    chunks = []
    current_chunk = []
    for i, value in enumerate(peaks):
        if value != 0:
            current_chunk.append((value, i))  # Store value and index
        else:
            if current_chunk:
                chunks.append(current_chunk)
                current_chunk = []
    if current_chunk:
        chunks.append(current_chunk)

    max_values_and_indices = []
    for chunk in chunks:
        if chunk:
            max_value, max_index = max(chunk, key=lambda x: x[0])
            max_values_and_indices.append((max_value, max_index))

    num_rows = 7

    if num_samples == 1024:
        horizontal_scale = 10
        filename = 'ppg-1024-samples.jpg'
    elif num_samples == -1:
        horizontal_scale = 30
        filename = 'ppg-full-data.jpg'
    else:
        raise ValueError

    # Plotting
    plt.figure(figsize=(horizontal_scale, 15))  # Increase the vertical size to accommodate all subplots

    # Plot raw data
    plt.subplot(num_rows, 1, 1)
    plt.plot(timestamps, data, label='Raw PPG Data')
    plt.title('Raw PPG Signal')
    plt.xlabel('Time')
    plt.ylabel('Amplitude')
    plt.grid(True)
    plt.legend(loc='upper right')

    # Plot filtered data
    plt.subplot(num_rows, 1, 2)
    plt.plot(timestamps, filtered_data, label='Filtered Data')
    plt.title('Filtered PPG Signal (0.4-4 Hz bandpass)')
    plt.xlabel('Time')
    plt.ylabel('Amplitude')
    plt.grid(True)
    plt.legend(loc='upper right')

    # Plot upper envelope
    plt.subplot(num_rows, 1, 3)
    plt.plot(timestamps, filtered_data, label='Filtered Data')
    plt.plot(timestamps, upper_envelope, label='Upper Envelope', linestyle='--', c=upper_color)
    plt.title('Upper Envelope')
    plt.xlabel('Time')
    plt.ylabel('Amplitude')
    plt.grid(True)
    plt.legend(loc='upper right')

    # Plot lower envelope
    plt.subplot(num_rows, 1, 4)
    plt.plot(timestamps, filtered_data, label='Filtered Data')
    plt.plot(timestamps, upper_envelope, label='Upper Envelope', linestyle='--', c=upper_color)
    plt.plot(timestamps, lower_envelope, label='Lower Envelope', linestyle='--', c=lower_color)
    plt.title('Lower Envelope')
    plt.xlabel('Time')
    plt.ylabel('Amplitude')
    plt.grid(True)
    plt.legend(loc='upper right')

    # Plot peaks
    plt.subplot(num_rows, 1, 5)
    plt.plot(timestamps, display_peaks, label='Peaks')
    plt.plot(timestamps, lower_envelope, label='Lower Envelope', linestyle='--', c=lower_color)
    plt.title('Peaks')
    plt.xlabel('Time')
    plt.ylabel('Amplitude')
    plt.grid(True)
    plt.legend(loc='upper right')

    # Plot peak detection
    plt.subplot(num_rows, 1, 6)
    plt.plot(timestamps, display_peaks, label='Peaks')
    plt.plot(timestamps, lower_envelope, label='Lower Envelope', linestyle='--', c=lower_color)
    # plt.plot(timestamps, lower_envelope, label='Lower Envelope', linestyle='--', c=lower_color)
    for m in max_values_and_indices:
        # plt.scatter(timestamps[m[1]], m[0], c=peak_color)
        plt.axvline(timestamps[m[1]], c=peak_color)
    plt.title('Peak Detection')
    plt.xlabel('Time')
    plt.ylabel('Amplitude')
    plt.grid(True)
    plt.legend(loc='upper right')

    # Plot peak detection on raw data
    plt.subplot(num_rows, 1, 7)
    plt.plot(timestamps, data, label='Raw PPG Data')
    for m in max_values_and_indices:
        # plt.scatter(timestamps[m[1]], m[0], c=peak_color)
        plt.axvline(timestamps[m[1]], c=peak_color)
    plt.title('Peak Detection Overlay on Raw Data')
    plt.xlabel('Time')
    plt.ylabel('Amplitude')
    plt.grid(True)
    plt.legend(loc='upper right')

    # Automatically adjust the layout of the plots to prevent overlap
    plt.tight_layout()

    plt.savefig(f'/Users/ericyates/Downloads/{filename}')
    # plt.savefig(f'/Users/ericyates/Downloads/ppg-{datetime.now()}.jpg')

    # # Plotting
    # plt.figure(figsize=(10, 6))

    # # Plot raw data
    # plt.subplot(2, 1, 1)
    # plt.plot(timestamps, data, label='Raw Data')
    # plt.title('Raw PPG Signal')
    # plt.xlabel('Time')
    # plt.ylabel('Amplitude')
    # plt.grid(True)
    # plt.legend()

    # # Plot filtered data
    # plt.subplot(2, 1, 2)
    # plt.plot(timestamps, filtered_data, label='Filtered Data (0.4-4 Hz)')
    # plt.plot(timestamps, upper_envelope, label='Upper Envelope', linestyle='--')
    # plt.plot(timestamps, lower_envelope, label='Lower Envelope', linestyle='-')
    # plt.plot(timestamps, peaks, label='Peaks', linestyle='-.')
    # plt.title('Filtered PPG Signal with Envelope')
    # plt.xlabel('Time')
    # plt.ylabel('Amplitude')
    # plt.grid(True)
    # plt.legend()

    # plt.show()


if __name__ == '__main__':
    main()
